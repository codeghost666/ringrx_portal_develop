class PbxOnCallController < ActionController::Base
    #include ActionController::MimeResponds

    before_action :authenticate_request!

    def get_by_user
        oncalls = PbxOnCall.load_by_user(@current_user)
        render json: oncalls.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_oncall = PbxOnCall.load_from_json(params[:pbx_on_call].to_json)
        if update_oncall.valid?
            response = update_oncall.save(@current_user)
            if response.code != 200
                render json: response.to_json, status: response.code
            end
        end
        render json: update_oncall.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_oncall = PbxOnCall.load_from_json(params[:pbx_on_call].to_json)
        if create_oncall.valid?
            response = create_oncall.save(@current_user)
            if response.code != 200
                render json: response.to_json, status: response.code
            end
        end
        render json: create_oncall.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        PbxOnCall.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def pdf
        # @schedules  = PbxOnCall.load_by_user(@current_user)
        # @date       = month
        # @month      = @date.strftime("%m").to_i
        # @schedule   = @schedules.first

        raw = PbxOnCall.load_by_user(@current_user).first
        @schedules = raw.pbx_oncall_shifts
        #@schedules = @schedules.reorder("departments.position, schedules.starts_at") if current_account.department_mode
        #@departments = current_account.departments
        #@shift_templates = current_account.shift_templates.includes(:department, :shift_template_days)

        #@date       = params[:month] ? Date.parse(params[:month]) : Date.today

        @month      = Date.today
        @year      = Date.today
        #@month      = params[:month].to_i
        #@year      = params[:year].to_i

        _version = "v#{Time.now.strftime('%Y%m%d%H%M')}"
        respond_to do |format|
            format.any do
                render pdf: "#{raw.name} Calendar #{_version}",
                template: "schedules/pdf.html.haml",
                orientation: 'Landscape',
                disposition: 'attachment',
                header: {
                    center: "#{raw.name} Calendar",
                    font_size: 16,
                    line: true
                },
                footer: {
                    left: "RingRx LLC. Copyright 2018",
                    center: _version,
                    right: "support@ringrx.com",
                    font_size: 10,
                    line: true
                }
            end
        end
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def shift_create
        oncalls = PbxOnCall.load_by_user(@current_user)
        selected_oncall = oncalls.find_all { |obj| obj.id.to_s == params[:pbx_oncall_id].to_s}.first
        shift = PbxOnCallShift.load_from_json(params[:pbx_oncall_shift].to_json)
        selected_oncall.pbx_oncall_shifts.push(shift)
        if selected_oncall.valid?
            response = selected_oncall.save(@current_user)
            if response.code != 200
                render json: response.to_json, status: response.code
            end
        end
        #render json: selected_oncall.to_json
        render json: selected_oncall.pbx_oncall_shifts.find_all { |obj| obj.priority == shift.priority.to_s}.first
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def shift_update
        oncalls = PbxOnCall.load_by_user(@current_user)
        selected_oncall = oncalls.find_all { |obj| obj.id.to_s == params[:pbx_oncall_id].to_s}.first
        shift = PbxOnCallShift.load_from_json(params[:pbx_oncall_shift].to_json)
        selected_oncall.pbx_oncall_shifts.delete_if { |obj| obj.id.to_s == shift.id.to_s}
        selected_oncall.pbx_oncall_shifts.push(shift)
        if selected_oncall.valid?
            response = selected_oncall.save(@current_user)
            if response.code != 200
                render json: response.to_json, status: response.code
            end
        end
        render json: selected_oncall.pbx_oncall_shifts.find_all { |obj| obj.priority == shift.priority.to_s}.first
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def shift_delete
        response = PbxOnCall.delete_shift(@current_user, params[:pbx_oncall_id], params[:id])
        if response.code == 200
            render json: response.to_json, status: 204
        else
            render json: response.to_json, status: response.code
        end
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def user_delete
        response = PbxOnCall.delete_user_from_shift(@current_user, params[:pbx_oncall_id], params[:id], params[:user_id])
        if response.code == 200
            render json: response.to_json, status: 204
        else
            render json: response.to_json, status: response.code
        end
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def moh
        render json: PbxOnCall.moh(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def mediafiles
        render json: PbxOnCall.mediafiles(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def mailboxes
        render json: PbxOnCall.mailboxes(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def phonenumbers
        render json: PbxOnCall.phonenumbers(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def pbx_users
        render json: PbxOnCall.pbx_users(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_new
        response = PbxOnCall.get_new(@current_user)
        render json: response, status: response.code
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end





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
