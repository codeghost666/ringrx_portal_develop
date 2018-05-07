class PbxFaxController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        faxes = PbxFax.load_by_user(@current_user)
        unless faxes.first.kind_of? PbxFax
            faxes
        else
            render json: faxes.to_json
        end        
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_fax = PbxFax.load_from_json(params[:pbx_fax].to_json)
        if update_fax.valid?
            response = update_fax.save(@current_user) 
            if response.code != 200
                response
            end
        end
        render json: update_fax.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_fax = PbxFax.load_from_json(params[:pbx_fax].to_json)
        if create_fax.valid?
            response = create_fax.save(@current_user)
            if response.code != 200
                response
            end
        end
        render json: create_fax.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        PbxFax.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_phonenumbers
        render json: PbxFax.get_phonenumbers(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_formats
        render json: PbxFax.get_formats(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_destination_types
        render json: PbxFax.get_destination_types(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_mailboxes
        render json: PbxFax.get_mailboxes(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_extensions
        render json: PbxFax.get_extensions(@current_user)
    rescue => e
        Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
        
end