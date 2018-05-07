class VoicemailController < ApplicationController

  before_action :authenticate_request!

  def get_by_user
    messages = VoicemailMessage.load_by_user(@current_user)
    render json: messages.to_json
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def get_by_message_id
    message = VoicemailMessage.load_by_message_id(@current_user, params[:id])
    render json: message.to_json
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def create
    newVoicemailMessage = VoicemailMessage.load_from_json(params[:voicemail].to_json)
    newVoicemailMessage.mailbox = @current_user[:username] + '@' + @current_user[:domain]
    if newVoicemailMessage.valid?
      newVoicemailMessage.save(@current_user)
    end
    render json: newVoicemailMessage.to_json
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def update
    updateMessage = VoicemailMessage.load_from_json(params[:voicemail].to_json)
    if updateMessage.valid?
      response = updateMessage.save(@current_user)
      render json: response.to_json
    end
#    render json: updateMessage.to_json
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def delete
    VoicemailMessage.delete(@current_user, params[:id])
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def voice_payload
    send_data VoicemailMessage.voice_payload(@current_user, params[:id])
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def fax_payload
    send_data VoicemailMessage.fax_payload(@current_user, params[:id])
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def message_count
    unread = VoicemailMailbox.mwi_by_user(@current_user)
    render json: unread
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def submit_fax
    response = VoicemailMessage.send_fax(@current_user, params[:called_number], params[:faxfile])
        render response.to_json, status: response.code
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

end
