pipeline {
    agent any

    environment {
        // You can define environment variables here if needed
        COMPOSE_PROJECT_NAME = 'management'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically checks out the code from the SCM configured in the job
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                echo 'Building and starting Docker containers...'
                // Using docker compose v2 syntax
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking running containers...'
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed. Please check the Jenkins logs.'
        }
    }
}
