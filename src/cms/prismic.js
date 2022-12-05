import * as prismic from '@prismicio/client'

// Fill in your repository name
export const repositoryName = process.env.REACT_APP_PRISMIC_REPO_NAME

export const client = prismic.createClient(repositoryName, {
  // If your repository is private, add an access token
  accessToken: process.env.REACT_APP_PRISMIC_ACCESS_TOKEN,

  // This defines how you will structure URL paths in your project.
  // Update the types to match the Custom Types in your project, and edit
  // the paths to match the routing in your project.
  //
  // If you are not using a router in your project, you can change this
  // to an empty array or remove the option entirely.
  routes: [
    {
        type: 'form_question',
        path: '/',
    },
    {
        type: 'form_general',
        path: '/',
    },
    {
        type: 'form_question_dropdown',
        path: '/',
    },
    {
        type: 'results',
        path: '/results',
    }
  ],
})