---
layout:   post
title:    "Saving multiple models with Form Objects and Transactions"
subtitle: "Forget accepts_nested_attributes_for and fields_for."
date:     2017-04-20 14:51:53 +0100
adapted:
  publication: "Runtime Revolution blog"
  url:    https://revs.runtime-revolution.com/saving-multiple-models-with-form-objects-and-transactions-2c26f37f7b9a
tags:
  - Code Quality
  - Ruby
  - Rails
---

[We've talked before about form objects][in creating form objects] and how they can simplify our Rails views.
Now I'd like to present a more complex scenario and one way to tackle it.

We have two associated models:

```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_one :location
end

# app/models/location.rb
class Location < ApplicationRecord
  belongs_to :user
end
```

We want to create one instance of each model using a single registration form.

---

If we reached for the Rails toolbox we would find the *nested form*®™:
[`fields_for`], [`accepts_nested_attributes_for`], maybe even [`inverse_of`].
This would require the following code at the least:

```erb
# app/views/registration/new.html.erb
<%= form_for @user do |f| %>
  <%= f.email_field :email %>

  <%= f.fields_for @user.build_location do |g| %>
    <%= g.text_field :country %>
  <% end %>
<% end%>

# app/models/user.rb
class User
  accepts_nested_attributes_for :location
end
```

Here's what I already don't like about this approach:

1. The view is coupled to the database structure.
   If we decide to make changes to the database schema later the form will need to be updated.

2. Whitelisting attributes with [strong parameters gets more complicated].

3. The `User` class contains logic to deal with `Location`'s attributes.
   This code is at odds with the [Single Responsibility Principle].
   This is even more apparent when using [`reject_if`].

4. It is not clear what happens when `save` is called.
   If `location` is invalid, does `user` get saved? What if it's the other way around?

---

So here's an alternate proposal: use a form object!
[As we saw last time][in creating form objects], all we need to do is to include `ActiveModel::Model`.
In this case though, since we want to persist our data, we have to implement a `save` method:

```ruby
class Registration
  include ActiveModel::Model

  attr_accessor :email, :password, :country, :city

  def save
    # Save User and Location here
  end
end
```

Meanwhile our view should look something like this:

```erb
<%= form_for @contact do |f| %>
  <%= f.label :email %>
  <%= f.email_field :email %>

  <%= f.input :password %>
  <%= f.text_field :password %>

  <%= f.input :country %>
  <%= f.text_field :country %>

  <%= f.input :city %>
  <%= f.text_field :city %>

  <%= f.button :submit, 'Create account' %>
<% end %>
```

And our controller like this:

```ruby
class RegistrationsController < ApplicationController
  def create
    @registration = Registration.new(params)

    if @registration.save
      redirect_to @registration, notice: 'Registration successful!'
    else
      render :new
    end
  end
end
```

Now, `save`'s API goes like this: "return `true` if the model is saved and `false` if the model cannot be saved".
In our implementation we'll return `true` if *all* models are saved and `false` if *any* of the models cannot be saved.

```ruby
class Registration
  # ...

  def save
    return false if invalid?

    ActiveRecord::Base.transaction do
      user = User.create!(email: email, password: password)
      user.create_location!(country: country, city: city)
    end

    true
  rescue ActiveRecord::StatementInvalid => e
    # Handle exception that caused the transaction to fail
    # e.message and e.cause.message can be helpful
    errors.add(:base, e.message)

    false
  end
end
```

The trick here is to wrap the saving calls in a [transaction] and use `create!` instead of `create`.
A Rails method with an exclamation point will usually throw an error on failure.
And transactions are rolled back when an exception is raised.
This means that if one model fails to save then none of the models are saved.
Finally, rescuing the error and returning `false` will signal that something went wrong.

And that's it!

---

Points worthy of note:

* By [adding validations to form objects] we effectively decouple validations from models.
  If we want to require users to enter their email we can add an email validation to the Registration form object.
  At the same time we can create a different sign up process (using a social network or a phone number) where users do not have to enter their email.
  This would be complicated to do if we added an email validation to the `User` model.

* We can turn a database exception (like [an email uniqueness constraint]) into an error by doing something like:

  ```ruby
  rescue ActiveRecord::RecordNotUnique
    errors.add(:email, :taken)
  end
  ```

  For a more in-depth look at reusing database errors as validation errors, I suggest reading about
  [uniqueness validations], [rescuing Postgres errors] and [parsing Postgres error messages].

* We can add an error not directly associated with an attribute by using the symbol [`:base`]:

  ```ruby
  validate :user_invite

  def user_invite
    errors.add(:base, 'Missing invite token') unless token?
  end
  ```

Now go on and create your own form objects.
Add contextual validations.
Simplify your code!


[in creating form objects]: 2017-03-13-creating-form-objects-with-active-model.md
[`fields_for`]: https://api.rubyonrails.org/classes/ActionView/Helpers/FormHelper.html#method-i-fields_for
[`accepts_nested_attributes_for`]: https://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html#method-i-accepts_nested_attributes_for
[`inverse_of`]: https://thoughtbot.com/blog/accepts-nested-attributes-for-with-has-many-through
[strong parameters gets more complicated]: http://patshaughnessy.net/2014/6/16/a-rule-of-thumb-for-strong-parameters
[Single Responsibility Principle]: https://en.wikipedia.org/wiki/Single_responsibility_principle
[`reject_if`]: https://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html#method-i-accepts_nested_attributes_for
[transaction]: https://api.rubyonrails.org/classes/ActiveRecord/Transactions/ClassMethods.html
[adding validations to form objects]: 2017-09-14-validating-form-objects.md
[an email uniqueness constraint]: https://www.youtube.com/watch?v=yuh9COzp5vo&t=19m15s
[uniqueness validations]: https://thoughtbot.com/blog/the-perils-of-uniqueness-validations
[rescuing Postgres errors]: https://mentalized.net/journal/2013/10/10/humane-database-errors-in-activerecord/
[parsing Postgres error messages]: https://gist.github.com/bf4/5594532#file-validations-rb
[`:base`]: https://api.rubyonrails.org/classes/ActiveModel/Errors.html#method-i-add
