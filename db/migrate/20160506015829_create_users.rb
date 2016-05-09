class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.text :email
      t.text :password_digest
      t.text :nickname
      t.text :firstname
      t.text :lastname
      t.text :image
      t.text :bio
      t.timestamp
    end
  end
end
