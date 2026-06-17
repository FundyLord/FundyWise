# Database Schema

users
-----
id
name
created_at

groups
------
id
name
created_by
created_at

group_members
-------------
id
group_id
user_id
joined_at

expenses
--------
id
group_id
paid_by
amount
description
created_at

expense_participants
--------------------
id
expense_id
user_id
share_amount