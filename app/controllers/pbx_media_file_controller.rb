class PbxMediaFileController  < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        files = PbxMediaFile.load_by_user(@current_user)
        unless files.first.kind_of? PbxMediaFile
            files
        else
            render json: files.to_json
        end        
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_file = PbxMediaFile.new
        update_file.id = params[:pbx_media_file][:id]
        update_file.pbx_account_id = params[:pbx_media_file][:pbx_account_id]
        update_file.name = params[:pbx_media_file][:name]
        update_file.mediafile = params[:pbx_media_file][:mediafile]
        if update_file.valid?
            response = update_file.save(@current_user) 
            if response.code != 200
                response
            else
                update_file = PbxMediaFile.load_from_json(response.body)
            end
        end
        render json: update_file.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_file = PbxMediaFile.new
        create_file.name = params[:pbx_media_file][:name]
        create_file.pbx_account_id = params[:pbx_media_file][:pbx_account_id]
        create_file.mediafile = params[:pbx_media_file][:mediafile]
        if create_file.valid?
            response = create_file.save(@current_user)
            if response.code != 200
                response
            else
                create_file = PbxMediaFile.load_from_json(response.body)
            end
        end
        render json: create_file.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        PbxMediaFile.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

  def get_media
      response = PbxMediaFile.get_media(@current_user, params[:id])
      send_data response.body, :filename => /filename[^;\n=]*=((['"]).*?\2|[^;\n]*)/.match(response.headers[:content_disposition]).captures[0], :disposition => 'attachment', :type => response.headers[:content_type]
  rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

end