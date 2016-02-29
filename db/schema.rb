# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160227072743) do

  create_table "contatos", force: :cascade do |t|
    t.string   "nome"
    t.string   "telefone"
    t.string   "email"
    t.text     "assunto"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "contatos", ["email"], name: "index_contatos_on_email", unique: true

  create_table "paginas", force: :cascade do |t|
    t.string   "nome"
    t.string   "url"
    t.datetime "data_acesso"
    t.integer  "contato_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "paginas", ["contato_id"], name: "index_paginas_on_contato_id"

end
