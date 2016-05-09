# == Route Map
#
#       Prefix Verb   URI Pattern                  Controller#Action
#         root GET    /                            welcome#index
#     projects GET    /projects(.:format)          projects#index
#              POST   /projects(.:format)          projects#create
#  new_project GET    /projects/new(.:format)      projects#new
# edit_project GET    /projects/:id/edit(.:format) projects#edit
#      project GET    /projects/:id(.:format)      projects#show
#              PATCH  /projects/:id(.:format)      projects#update
#              PUT    /projects/:id(.:format)      projects#update
#              DELETE /projects/:id(.:format)      projects#destroy
#        users GET    /users(.:format)             users#index
#              POST   /users(.:format)             users#create
#     new_user GET    /users/new(.:format)         users#new
#    edit_user GET    /users/:id/edit(.:format)    users#edit
#         user GET    /users/:id(.:format)         users#show
#              PATCH  /users/:id(.:format)         users#update
#              PUT    /users/:id(.:format)         users#update
#              DELETE /users/:id(.:format)         users#destroy
#

Rails.application.routes.draw do
  get 'pages/show'

  get 'projects/index'

  get 'projects/new'

  get 'projects/edit'

  get 'projects/show'

  get 'users/index'

  get 'users/new'

  get 'users/edit'

  get 'users/show'

  root :to => 'pages#welcome'
  get '/triads' => 'pages#triads'

  resources :projects, :users
end
