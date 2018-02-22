Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'dashboard#index'
  namespace :api do
    scope :btc do
      get '/last5.json' => 'btc_price#last_five'
    end
  end
end
