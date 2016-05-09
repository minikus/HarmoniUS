class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.text :title
      t.text :instrument
      t.text :image
      t.timestamp
    end
  end
end
