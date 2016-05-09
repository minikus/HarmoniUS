# == Schema Information
#
# Table name: projects
#
#  id         :integer          not null, primary key
#  title      :text
#  instrument :text
#  image      :text
#

class Project < ActiveRecord::Base
end
