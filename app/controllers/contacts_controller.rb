class ContactsController < ApplicationController
    before_action :authenticate_request!

    def get_number_types
        render json: Contact.get_number_types(@current_user).to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_address_types
        render json: Contact.get_address_types(@current_user).to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_by_id
        contact = Contact.load_by_id(@current_user, params[:id])
        unless contact.kind_of? Contact
            returnStatus = contact.code
        else
            returnStatus = 200
        end
        render json: contact.to_json, status: returnStatus
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_by_user
        contacts = Contact.load_by_user(@current_user)
        render json: contacts.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_by_domain
        contacts = Contact.load_by_domain(@current_user)
        render json: contacts.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        newContact = Contact.load_from_json(@current_user, params[:contact].to_json)
        if newContact.valid?
            response = newContact.save(@current_user)
            if (response.code != 200)
                response
            end
        end
        render json: newContact.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        contact = Contact.load_by_id(@current_user, params[:id])
        contact.delete(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        updateContact = Contact.load_from_json(@current_user, params[:contact].to_json)
        if updateContact.valid?
            response = updateContact.save(@current_user)
            if (response.code != 200)
                response
            end
        end
        render json: updateContact.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
end
