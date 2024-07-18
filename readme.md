# This repo contains:

- ✅ a **db dump** of a small production skuilder webapp
- ✅ a couchdb `ini` file suitable for dev environments
- ✅ a script to launch a docker container that serves the above
- ❌ (todo) a script to refresh the production db dump against some source couchdb instance

# The state dump contains:

**Users** (log in with these username/password): 
- test/test
- student/student
- teacher/teacher

**Quilts** (Courses):
- *Emily* - spelling, phonetics, etc
- *Piano by Ear* - midi interaction
- *Anatomy* - visual cards
- ... and various others

**Classrooms**:
- (todo)

# Usage

**Prerequisite**: install `docker`.

```
./test-couch.sh start
./test-couch.sh stop
./test-couch.sh status
./test-couch.sh remove
```