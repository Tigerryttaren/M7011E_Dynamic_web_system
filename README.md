M7011E_Dynamic_web_system
=========================

School project for the course M7011E at Luleå technical University, Sweden.

#Requirements
	MongoDB
	Nodejs
	npm

#Dependent on the following nodejs modules

	express

	fs

	ejs

	mongoose-schema-extend

	passport

	passport-google

	mongoose

	crypto

#Installing node modules
	npm install *module*

#Other files required

workspace/dbsalt.dontsave

workspace/sessionsalt.dontsave

These need to look like: 
```json
{ "secret" : "supersecretsalt"}
```
Where supersecretsalt can be a string of your choice