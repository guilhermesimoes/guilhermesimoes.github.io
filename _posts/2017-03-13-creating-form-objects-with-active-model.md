---
layout: post
title:  "Creating Form Objects with ActiveModel"
date:   2017-03-13 16:00:45 +0100
published:
  publication: "Runtime Revolution blog"
  url: https://revs.runtime-revolution.com/creating-form-objects-with-activemodel-346e6c2abbf3
---
A form object is an object designed specifically to be passed to `form_for`.
It is often used to aggregate data to create multiple objects or to receive ephemeral data that is used and then discarded.

Rails 4 introduced a small handy module called `ActiveModel::Model`.
A Ruby class can mix in this module and gain [a ton of functionality], including:

* initialization with a hash of attributes

* validation of attributes

* presentation of errors

* interaction with view helpers like `form_for` and the new [`form_with`]

It basically allows a Ruby object to [quack] like an `ActiveRecord` model without being backed by a database table.
Exactly what we need to implement a form object.

---

A contact form is one of the easiest ways to acquire leads.
Here's how we want our view to look like — a simple form with 3 inputs and a button:

```erb
<%= form_for @contact do |f| %>
  <%= f.label :name %>
  <%= f.text_field :name %>

  <%= f.input :email %>
  <%= f.email_field :email %>

  <%= f.input :message %>
  <%= f.text_field :message %>

  <%= f.button :submit, 'Send message' %>
<% end %>
```

How could we make this work with a Ruby object? Simple! Include `ActiveModel::Model`:

```ruby
class Contact
  include ActiveModel::Model

  attr_accessor :email, :message, :name
end
```

Now here's how we want our controller to look like:

```ruby
class ContactsController < ApplicationController
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(params[:contact])
    if @contact.valid?
      # contact_email and to_h methods left as an exercise to the reader
      Mailer.contact_email(@contact.to_h).deliver
      redirect_to root_url, notice: 'Email sent!'
    else
      render :new
    end
  end
end
```

`valid?` is there to guarantee that a contact is valid before we send an email.
Let's add some validations like we would with any `ActiveRecord` model:

```ruby
class Contact
  # ...

  validates :email, :message, :name, presence: true
end
```

An `ActiveRecord` model has an [`errors`] object
that is populated when a validation fails — usually after calling `save`.
An `ActiveModel` object behaves in a similar fashion.

Calling `valid?` on `@contact` will run its validations and populate its errors object.
Afterwards we can use any of these methods in our code:

```ruby
@contact.errors.messages
#=> { email: ["can't be blank"], name: ["can't be blank"] }

@contact.errors.full_messages
#=> ["Email can't be blank", "Name can't be blank"]

@contact.errors[:email]
#=> ["can't be blank"]

@contact.errors.full_messages_for(:email)
#=> ["Email can't be blank"]
```

And that's it!

---

Points worthy of note:

* [`valid?` has an alias called `validate`].
  It also has an opposite method called `invalid?`.
  We can use these methods to validate an `ActiveModel` object and to populate its errors object.

* Some people like to add the suffix `Form` to their form objects. So `ContactForm` instead of `Contact`.
  This prevents naming collisions with `ActiveRecord` models — for example we could have both a `User` and a `UserForm`.
  Here I opted for the shorter term.
  In Rails, controllers are suffixed with `Controller` but models aren't suffixed.
  I view form objects more as models not connected to any databases.

* Rails automatically loads all files placed in the `app` folder.
  I always place form objects in `app/forms`.
  I would save this `Contact` class in `app/forms/contact.rb`.
  But this is a convention, not a rule.

Now go on and create your own form objects.
Add contextual validations.
Simplify your code!

[a ton of functionality]: http://api.rubyonrails.org/classes/ActiveModel.html
[`form_with`]: http://weblog.rubyonrails.org/2017/2/23/Rails-5-1-beta1/#unify-form_tagform_for-with-form_with
[quack]: https://robots.thoughtbot.com/back-to-basics-polymorphism-and-ruby#duck-typing
[`errors`]: http://guides.rubyonrails.org/active_record_validations.html#working-with-validation-errors
[`valid?` has an alias called `validate`]: http://apidock.com/rails/ActiveRecord/Validations/valid%3F
