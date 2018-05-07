class LoginController < ApplicationController

  def backend_server
      # Set this to the appropriate address if you are not running against the hosted dev stack
      if ENV['DEFAULT_BACKEND']
        ENV['DEFAULT_BACKEND']
      else 
        "https://engine01.dev2.ringrx.com:8443"
      end
  end

  def create
    if (params[:username])
      tokenData = credentialGrantUsername(params[:username].to_s, params[:password].to_s)
    end
    if (params[:email])
      tokenData = credentialGrantEmail(params[:email].to_s, params[:password].to_s)
    end
    if tokenData.nil?
      render json: {error: "Not Authenticated"}, status: :unauthorized
    else
      render json: tokenData
    end
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def refresh
    tokenData = refreshGrant(params[:refresh_token])
    if tokenData.nil?
      render json: {error: "Not Authenticated"}, status: :unauthorized
    else
      render json: tokenData
    end
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def validate
    authHeader = request.headers["Authorization"]
    if authHeader
      authHeader.slice! "Bearer "
      token = JsonWebToken.decode(authHeader)
      render json: token.to_json
    else
      render json: {error: "Not Authenticated"}, status: :unauthorized
    end
  rescue => e
    Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def reset_password
    reset_url = "#{backend_server}/auth/update"
    response = HTTParty.post(reset_url, :body => { :reset_password_token => params[:reset_password_token], :password => params[:password], :password_confirmation => params[:password_confirmation]  }, :headers => {"Content-Type" => 'application/x-www-form-urlencoded'}, :verify => false)
    if response.code == 200
      render json: {message: "Password has been reset" }, status: 200
    else
      render json: response.to_json, status: response.code
    end
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  def send_reset_password
    response = HTTParty.post(backend_server + '/auth/reset?username=' + params[:username].to_s, :headers => {"Content-Type" => 'application/json'}, :verify => false)
    if response.code == 200
      render json: {message: "Password Reset Email Sent" }, status: 200
    else
      render json: response.to_json, status: response.code
    end
    rescue => e
      Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
  end

  private

  def credentialGrantUsername(username, password)
    response = HTTParty.post(backend_server + '/auth/token?username=' + username + '&password=' + password, :headers => {"Content-Type" => 'application/json'}, :verify => false)
    if response.code == 200
      body = JSON.parse(response.body)
      return body
    else
      nil
    end
  end

  def credentialGrantEmail(email, password)
    response = HTTParty.post(backend_server + '/auth/token?email=' + email + '&password=' + password, :headers => {"Content-Type" => 'application/json'}, :verify => false)
    if response.code == 200
      body = JSON.parse(response.body)
      return body
    else
      nil
    end
  end

  def refreshGrant(refresh_token)
    decoded_refresh_token = JsonWebToken.decode(refresh_token)
    response = HTTParty.post(decoded_refresh_token[:backend] + '/auth/refresh?token=' + refresh_token, :headers => {"Content-Type" => 'application/json'}, :verify => false)
    if response.code == 200
      JSON.parse(response.body)
    else
      nil
    end
  end

  def parse_cookie(resp)
    cookie_hash = CookieHash.new
    resp.get_fields('Set-Cookie').each { |c| cookie_hash.add_cookies(c) }
    cookie_hash
  end

end

class CookieHash < Hash #:nodoc:
  CLIENT_COOKIES = %w(path expires domain path secure httponly)

  def add_cookies(value)
    case value
    when Hash
      merge!(value)
    when String
      value.split('; ').each do |cookie|
        array = cookie.split('=', 2)
        self[array[0].to_sym] = array[1]
      end
    else
      raise "add_cookies only takes a Hash or a String"
    end
  end

  def to_cookie_string
    select { |k, v| !CLIENT_COOKIES.include?(k.to_s.downcase) }.collect { |k, v| "#{k}=#{v}" }.join("; ")
  end
end
