class PbxMailboxAdminController < ApplicationController
  before_action :authenticate_request!
  def get
    mailboxes = PbxMailbox.load_by_user(@current_user)
    render json: mailboxes.to_json
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def create
    create_mailbox = PbxMailbox.load_from_json(params[:pbx_mailbox].to_json)
    if create_mailbox.valid?
      response = create_mailbox.save(@current_user)
      if response.code != 200
        render json: response.to_json, status: response.code
      else
        create_mailbox = PbxMailbox.load_from_json(response.body)
      end
    end
    render json: create_mailbox.to_json
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def update
    update_mailbox = PbxMailbox.load_from_json(params[:pbx_mailbox].to_json)
    if update_mailbox.valid?
      response = update_mailbox.save(@current_user)
      if (response.code != 200)
        render json: response.to_json, status: response.code
      else
        update_mailbox = PbxMailbox.load_from_json(response.body)
      end
    end
    render json: update_mailbox.to_json
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def delete
    PbxMailbox.delete(@current_user, params[:id])
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def get_status
    mailbox = PbxMailbox.status_by_user(@current_user, params[:id])
    render json: mailbox.to_json
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def get_greeting
    response = PbxMailbox.get_greeting(@current_user, params[:id])
    send_data response.body, :filename => /filename[^;\n=]*=((['"]).*?\2|[^;\n]*)/.match(response.headers[:content_disposition]).captures[0], :disposition => 'attachment', :type => response.headers[:content_type]
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def update_greeting
    response = PbxMailbox.save_greeting(@current_user, params[:id], params[:file])
    render nothing: true, status: response.code
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end
end
