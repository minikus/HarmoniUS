# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  email           :text
#  password_digest :text
#  nickname        :text
#  firstname       :text
#  lastname        :text
#  image           :text
#  bio             :text
#

class User < ActiveRecord::Base
end
