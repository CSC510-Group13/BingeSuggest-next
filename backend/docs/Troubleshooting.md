# Troubleshooting Guide

## MySQL with Github Actions

### Cannot find 'testdb.table' issue

When working with MySQL and github actions you may encounter an error that says ```cannot find 'testdb.table'``` despite having a table in that database with the same name. The cause for this error
may be an issue of case sensitivity. </br>
For example you may have added ```CREATE TABLE Table;``` in which case if you query this with a lower case t in table, mysql will not be able to find it. 

## UnitTest

### UnitTest VSCode issue
If you are on Windows and using VS code to edit the code and your tests are not being picked up by the editor, then follow these [steps](https://stackoverflow.com/questions/54387442/vs-code-not-finding-pytest-tests).
