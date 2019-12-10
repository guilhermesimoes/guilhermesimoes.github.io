---
layout:   post
title:    "Validating Form Objects"
subtitle: "Where should you place validations? In the model or in the form object?"
date:     2017-09-14 14:48:36 +0100
adapted:
  publication: "Runtime Revolution blog"
  url:    https://revs.runtime-revolution.com/validating-form-objects-8058fefc7b89
---
There's one question that comes up soon after [starting to use form objects]:

> Where should I place my validations? In the model or in the form object?

By default validations live in the model.

But if the form object has no validations then it does not validate user input!
We decide to move the validations from the model to the form object.

But now it's possible to create an invalid model in some other part of the code!
We decide to copy the validations and add them to both the model and the form object.

But now we are duplicating code! It's likely that these validations will diverge,
that some developer will change some validation in one place and not in the other.
We decide to extract the validations into a module (or a concern) and then include it in both the model and the form object.

But this spreads the code over another file and adds another level of indirection —
when we open up the model file it's not immediately obvious what its validations are.

There should be a better solution.

---

We can place *most* of the validations (more on this later) on the models.
On the form object we can delegate *down* validations to each "child model" and
promote *up* any errors found in the models.

Let's check an example of a form object:

```ruby
class Registration
  include ActiveModel::Model

  attr_accessor :email, :password, :country, :city

  def save
    ActiveRecord::Base.transaction do
      user.save!
      location.save!
    end
  end

  private

  def user
    @user ||= User.new(email: email, password: password)
  end

  def location
    @location ||= user.build_location(country: country, city: city)
  end
end
```

We can reuse the validations of `user` and `location` like this:

```ruby
class Registration
  # ...

  validate :validate_children

  def save
    return false if invalid?

    # ...
  end

  private

  def validate_children
    if user.invalid?
      promote_errors(user.errors)
    end

    if location.invalid?
      promote_errors(location.errors)
    end
  end

  def promote_errors(child_errors)
    child_errors.each do |attribute, message|
      errors.add(attribute, message)
    end
  end
end
```

Calling [`invalid?`] in the `save` method runs all the validations, including the `validate_children` method.
Since there's no easy way to move all the errors from one object to another,
we iterate over all the errors and add them one by one to the form object.

We can extract some of this logic into a base `FormObject` (or a concern) if we
start using this pattern a lot.

---

Still, there are *some* validations that should live in form objects.

I like to divide validations into two groups: **data integrity validations** and **business logic validations**.

Data integrity validations are concerned with the fidelity and quality of the data saved to the database.
All locations **must** have non-empty `country` and `city` attributes so this should be validated in the model:

```ruby
class Location < ApplicationRecord
  validates :country, presence: true
  validates :city, presence: true
end
```

These are database rules. Ideally these rules are mirrored on the database via its schema and its constraints:

```sql
ALTER TABLE locations
ALTER COLUMN country SET NOT NULL,
ALTER COLUMN city SET NOT NULL;
```

On the other hand, business logic validations are concerned with the
appropriateness and completeness of the data going through a certain workflow.
The email registration workflow requires users to enter an email and accept the
terms of service so this should be validated in the form object:

```ruby
class EmailRegistration
  include ActiveModel::Model

  validates :email, presence: true
  validates :terms_of_service, acceptance: true
end
```

These are contextual rules. These rules only apply to this particular use case.
Think of how much harder it would be to create a phone registration workflow
if the `email` validation lived in the `User` model.

Contextual rules enforced on the model level are global rules.

Whenever you find yourself needing to [skip a validation] in certain situations
or needing to configure when a validation should run with the [`:on`] option,
try to see if there's a way to extract that validation and that logic into a form object.

---

We now want to ensure that emails entered in the email registration workflow are unique.
Since the `email` presence validation lives in the `EmailRegistration` form object
we'd be inclined to add the new validation there:

```diff
class EmailRegistration
  include ActiveModel::Model

-  validates :email, presence: true
+  validates :email, presence: true, uniqueness: true
end
```

Yet, if the user is able to change his email later on, he can pick an email that is already taken.
We can't let this happen. *If* a user has an email then it **must** be unique.
This is a data integrity validation and it should live in the model:

```diff
class User
+  validates :email, uniqueness: true, allow_blank: true
end
```

Learning to distinguish between these two types of validations is essential to the design and structure of our applications.

### Conclusions

* Don't mix data integrity validations with business logic validations.

* Place data integrity validations inside models.

* Place business logic validations inside form objects.

* Promote model errors to form object errors.

Now go on and create your own form objects.
Add contextual validations.
Simplify your code!


[starting to use form objects]: 2017-04-20-saving-multiple-models-with-form-objects-and-transactions.md
[`invalid?`]: https://api.rubyonrails.org/classes/ActiveModel/Validations.html#method-i-invalid-3F
[skip a validation]: https://stackoverflow.com/questions/8881712/skip-certain-validation-method-in-model
[`:on`]: https://guides.rubyonrails.org/active_record_validations.html#on
