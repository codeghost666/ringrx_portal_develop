export default function validateForwardDestinationPresence (/* options = {} */) {
  return (key, newValue, oldValue, changes, content) => {
    if ((content.get('forward') && changes.forward === undefined) || changes.forward) {
      if (newValue.length) {
        return true
      } else {
        return 'Forward Destination can\'t be blank'
      }
    } else {
      return true
    }
  }
}
