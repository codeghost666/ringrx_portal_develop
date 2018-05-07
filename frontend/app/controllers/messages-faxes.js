import Controller from '@ember/controller';
import { computed} from '@ember/object'
import MailboxValidations from '../validations/mailbox'

export default Controller.extend({
  MailboxValidations,
  messageTypeInbox: '',
  messageTypeSent: '',
  messageTypeTrash: ''
});
