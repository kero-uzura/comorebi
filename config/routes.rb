Rails.application.routes.draw do
  get 'top/index'

  root to: 'top#index'

  namespace :admin do
    root to: 'users#index'
    resources :users
  end
end
