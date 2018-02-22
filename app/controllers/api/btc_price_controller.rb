module Api
    class BtcPriceController < ApplicationController
        def last_five
            data = []
            max = []
            min = []
            #     { year: '2008', value: 5 },
            #     { year: '2009', value: 8 },
            #     { year: '2010', value: 12 },
            #     { year: '2011', value: 22 },
            #     { year: '2012', value: 18 }
            #   ]
            btcs = BtcPrice.order(:date)
            high_price = btcs.first.usd
            high_price_date = btcs.first.date
            low_price = btcs.first.usd
            low_price_date = btcs.first.date
            btcs.each do |btc|
                if btc.usd>high_price
                    high_price = btc.usd
                    high_price_date = btc.date
                end
                if btc.usd<low_price
                    low_price = btc.usd
                    low_price_date = btc.date
                end
                date = btc.date.strftime("%Y-%m-%d %H:%M").to_datetime

                if (date.minute % 30 == 0)
                    data << {
                        date: "#{(btc.date-3.hours).strftime("%Y-%m-%d %H:%M")}", usd: "#{btc.usd.to_i}"
                    }
                end
            end
            max << {
                date: (high_price_date-3.hours).strftime("%Y-%m-%d %H:%M"), usd: high_price.to_i
            }
            min << {
                date: (low_price_date-3.hours).strftime("%Y-%m-%d %H:%M"), usd: low_price.to_i
            }
            render json: { price: data.last(48), max: max, min: min }
        end

        def last_highs
            data = []
            max = []
            min = []
            #     { year: '2008', value: 5 },
            #     { year: '2009', value: 8 },
            #     { year: '2010', value: 12 },
            #     { year: '2011', value: 22 },
            #     { year: '2012', value: 18 }
            #   ]
            btcs = BtcPrice.order(:date)
            high_price = btcs.first.usd
            high_price_date = btcs.first.date
            low_price = btcs.first.usd
            low_price_date = btcs.first.date
            btcs.each do |btc|
                if btc.usd>high_price
                    high_price = btc.usd
                    high_price_date = btc.date
                end
                if btc.usd<low_price
                    low_price = btc.usd
                    low_price_date = btc.date
                end
                date = btc.date.strftime("%Y-%m-%d %H:%M").to_datetime

                if (date.minute % 30 == 0)
                    data << {
                        date: "#{(btc.date-3.hours).strftime("%Y-%m-%d %H:%M")}", usd: "#{btc.usd.to_i}"
                    }
                end
            end
            max << {
                date: (high_price_date-3.hours).strftime("%Y-%m-%d %H:%M"), usd: high_price.to_i
            }
            min << {
                date: (low_price_date-3.hours).strftime("%Y-%m-%d %H:%M"), usd: low_price.to_i
            }
            render json: { price: data.last(48), max: max, min: min, yest: data.last(96).last(48) }
        end
    end
end