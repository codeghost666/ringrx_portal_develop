class ApplicationController < ActionController::API

    attr_reader :current_user

    protected
    def authenticate_request!
      unless is_token_valid?
        render json: { errors: ['Not Authenticated'] }, status: :unauthorized
        return
      end
      @current_user = auth_token
    rescue JWT::VerificationError, JWT::DecodeError => err
      render json: { errors: ['Not Authenticated'] }, status: :unauthorized
    end
  
    private
    def http_token
        @http_token ||= if request.headers['Authorization'].present?
          request.headers['Authorization'].split(' ').last
        end
    end
  
    def auth_token
      @auth_token ||= JsonWebToken.decode(http_token)
    end
  
    def is_token_valid?
      http_token && auth_token && auth_token[:backend].to_s
      rescue => e
        Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

end
