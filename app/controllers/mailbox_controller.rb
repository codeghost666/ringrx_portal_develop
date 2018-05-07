class MailboxController < ApplicationController
    before_action :authenticate_request!

    def get_mailbox_summary
        mailbox = VoicemailMailbox.load_by_user(@current_user)
        render json: mailbox.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update_mailbox_summary
        updateMailbox = VoicemailMailbox.load_from_json(params[:mailbox].to_json)
        if updateMailbox.valid?
            response = updateMailbox.save(@current_user)
            if (response.code != 200)
                response
            end
        end
        render json: updateMailbox.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_greeting
        response = VoicemailMailbox.get_greeting(@current_user)
        send_data response.body, :filename => /filename[^;\n=]*=((['"]).*?\2|[^;\n]*)/.match(response.headers[:content_disposition]).captures[0], :disposition => 'attachment', :type => response.headers[:content_type]
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update_greeting
        response = VoicemailMailbox.save_greeting(@current_user, params[:file])
        render nothing: true, status: response.code
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
end