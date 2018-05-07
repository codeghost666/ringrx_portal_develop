class PbxUserController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        user = PbxUser.load_by_user(@current_user)
        unless user.first.kind_of? PbxUser
            user
        else
            render json: user.to_json
        end        
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_user = PbxUser.load_from_json(params[:pbx_user].to_json)
        if update_user.valid?
            response = update_user.save(@current_user) unless update_user.nil?
            if response.code != 200
                response
            end
        end
        render json: update_user.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_user = PbxUser.load_from_json(params[:pbx_user].to_json)
        if create_user.valid?
            response = create_user.save(@current_user) unless create_user.nil?
            if response.code != 200
                response
            end
        end
        render json: create_user.to_json, status: 201
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        PbxUser.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_forward_behaviors
        render json: PbxUser.get_forward_behaviors(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_oncall_behaviors
        render json: PbxUser.get_oncall_behaviors(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def mailboxes
        render json: PbxUser.mailboxes(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def roles
        render json: PbxUser.roles(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def locations
        render json: PbxUser.locations(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def fax_extensions
        render json: PbxUser.fax_extensions(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
end