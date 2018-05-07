class CallRecord < RestModel

  property :id, field: :aleg_uuid
  #property :switchname
  property :pbx_account_id
  #property :domain_name
  #property :responsible_party
  #property :aleg_uuid
  #property :aleg_profile
  #property :aleg_from_host
  #property :aleg_contact
  #property :aleg_user_agent
  #property :bleg_uuid
  #property :bleg_profile
  #property :gateway_name
  #property :bleg_to_host
  #property :bleg_contact
  #property :bleg_user_agent
  property :start_time
  #property :pdd
  #property :answered_time
  #property :end_time
  property :hangup_cause
  #property :sip_hangup_cause
  #property :context
  #property :dialed_digits
  property :calling_party
  property :called_party
  property :caller_id_number
  property :caller_id_name
  #property :duration
  property :bill_duration
  #property :aleg_mos
  #property :bleg_mos
  #property :aleg_quality_percentage
  #property :bleg_quality_percentage

  def self.load_by_user(currentUser, start_date, end_date)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    if start_date && end_date
      requestURL = requestURL + "?start_date=#{start_date}&end_date=#{end_date}"
    elsif start_date
      requestURL = requestURL + "?start_date=#{start_date}"
    end
    response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    CallRecord.from_source(JSON.parse(response.body))
  end

  def self.load_by_domain(currentUser, start_date, end_date)
    requestURL = "#{currentUser[:backend]}#{baseURL}/domain"
    if start_date && end_date
      requestURL = requestURL + "?start_date=#{start_date}&end_date=#{end_date}"
    elsif start_date
      requestURL = requestURL + "?start_date=#{start_date}"
    end
    response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    CallRecord.from_source(JSON.parse(response.body))
  end

  private

  # def baseURL
  #     "/api/v1/portal_call_records"
  # end

  # def getHeaders(token)
  #     encoded_token = JsonWebToken.encode(token)
  #     { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
  # end

  def self.baseURL
    "/api/v1/portal_call_records"
  end

  def self.getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

end