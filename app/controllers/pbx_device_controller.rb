class PbxDeviceController < ApplicationController
  before_action :authenticate_request!

  def get_by_user
    devices = PbxDevice.load_by_user(@current_user)
    unless devices.kind_of? Array
      devices
    else
      render json: devices.to_json
    end
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def update
    update_device = PbxDevice.load_from_json(params[:pbx_device].to_json)
    if update_device.valid?
      response = update_device.save(@current_user)
      if response.code != 200
        response
      else
        update_device = PbxDevice.load_from_json(response.body)
      end
    end
    render json: update_device.to_json
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def create
    create_device = PbxDevice.load_from_json(params[:pbx_device].to_json)
    if create_device.valid?
      response = create_device.save(@current_user)
      if response.code != 200
        response
      end
    end
    render json: create_device.to_json
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def delete
    PbxDevice.delete(@current_user, params[:id])
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def delete_binding
    response = PbxDevice.delete_binding(@current_user, params[:binding_id], params[:device_id])
    if response.code == 200
      render json: response.to_json, status: 204
    else
      response
    end
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def device_types
    render json: PbxDevice.device_types(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def device_signaling
    render json: PbxDevice.device_signaling(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def binding_types
    render json: PbxDevice.binding_types(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def binding_behaviors
    render json: PbxDevice.binding_behaviors(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def pbx_users
    render json: PbxDevice.pbx_users(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def pbx_parking_lots
    render json: PbxDevice.pbx_parking_lots(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def signaling
    render json: PbxDevice.signaling(@current_user)
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

end
