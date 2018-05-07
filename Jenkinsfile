#!groovy


node('linux'){
    //Checkout
	checkout scm
    // def image
    // stage('Build Docker Image') {
    //     image = docker.build('ringrx/ci-portal:latest', '-f ./docker/Dockerfile ./docker')
    // }
    sh 'docker pull inxaos/ci-portal:latest'
    docker.image('inxaos/ci-portal:latest').inside('-v ${WORKSPACE}:/source'){
	//image.inside('-v ${WORKSPACE}:/source'){
        //Run Ruby Prep inside docker
        //Run NPM prep inside docker
        //Run Ruby Test inside docker
        //Run Ember Test inside docker
        //Publish Ruby Tests
        //Publish Ember Tests (TAP File)

        //Publish Ember??
        //Create Zip File
        //Push Zip to Hosted Location
	    stage('Build') {
            sh 'cd /source; bundle install; rake ember:install'
            sh 'cd /source/frontend; npm install'
            sh 'cd /source/frontend; npm install node-sass'
            sh 'cd /source/frontend; bower install'
            sh 'cd /source/frontend; ember build'
            //sh 'cd /source/frontend; ember test | tee ember.tap'
	    }
	    stage('Test'){
            sh 'cd /source; bundle exec rake build spec'
            sh 'cd /source/frontend; npm outdated'
            sh 'cd /source/frontend; ember test | tee ember.tap'
            //TODO: How do I publish the ember tests in a usable way?            
	    }
        stage('Reports'){
            junit '/source/frontend/ember.tap'

            publishHTML (target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: "RCov Report"
                ])
        }
        stage('Publish'){
            // if (env.BRANCH_NAME == 'release') {
            //     Publish / Precompile / Zip / Push to S3?
            // }
        }
	}
    //Delete Local Docker Images for project???
    //Build Docker Image    
}