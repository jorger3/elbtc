class DashboardController < ApplicationController
	def index
		@btc_prices = BtcPrice.where("date > ?", Time.now-1.day).order(:usd)
		@current_price = BtcPrice.order(:date).last

		@high_per = (100-@btc_prices.last.usd*100/@current_price.usd).round(2)
		@low_per = (100-@btc_prices.first.usd*100/@current_price.usd).round(2)

	end
end
