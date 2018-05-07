import EmberRouter from '@ember/routing/router'
import config from './config/environment'

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('not-found', {path: '/*path'})
  this.route('not-found-route', { path: 'not-found' })
  this.route('login')
  this.route('remind-password')
  this.route('resend-instructions')
  this.route('reset-password', {path: '/reset-password/:resetPasswordToken'})
  //We need to figure out why this below got super cranky
  this.route('authenticated', {path: '/'}, function () {
    this.route('dashboard', {resetNamespace: true})
    this.route('messages-faxes', {resetNamespace: true}, function(){
      this.route('new-fax')
    })
    this.route('calls', {resetNamespace: true})
    this.route('on-calls', {resetNamespace: true})
    this.route('my-phone', {resetNamespace: true}, function(){
      this.route('on-call-settings');
    })
    this.route('contacts', {path: '/contact', resetNamespace: true}, function () {
      this.route('new')
      this.route('edit', {path: '/:contact_id/edit'})
    }) //contacts
    this.route('settings', {resetNamespace: true}, function() {
      this.route('phone-numbers', {path: '/phone-numbers'}, function() {
        this.route('edit', {path: '/:phonenumber_id/edit'})
        this.route('new')
      }) //phone-numbers
      this.route('faxes', function() {
        this.route('edit', {path: '/:pbxFax_id/edit'})
        this.route('new')
      }) //faxes
      this.route('users', function() {
        this.route('edit', {path: '/:pbxuser_id/edit'})
        this.route('new')
      }) //users
      this.route('locations', function() {
        this.route('edit', {path: '/:pbxLocation_id/edit'})
        this.route('new')
      }) //locations
      this.route('groups', function() {
        this.route('edit', {path: '/:pbxGroup_id/edit'})
        this.route('new')
      }) //groups
      this.route('devices', function () {
        this.route('edit', {path: '/:pbxDevice_id/edit'})
        this.route('new')
      }) //devices
      this.route('parking-lots', function() {
        this.route('edit', {path: '/:pbxParkingLot_id/edit'})
        this.route('new')
      }) //parking-lots
      this.route('media-files', function() {
        this.route('new')
        this.route('edit',{path: '/:pbxMediaFile_id/edit'})
      }) //media-files
      this.route('mailboxes', function() {
        this.route('edit', {path: '/:pbxMailbox_id/edit'});
        this.route('new');
      });
        this.route('audit-logs');
    }) //settings
  }) //authenticated
}) //application

export default Router
