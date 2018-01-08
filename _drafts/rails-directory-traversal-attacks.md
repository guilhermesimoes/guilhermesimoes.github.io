---
layout:   post
title:    "Rails directory traversal attacks"
---

https://blog.heroku.com/rails-asset-pipeline-vulnerability

https://pentesterlab.com/exercises/web_for_pentester/course
https://www.ruby-forum.com/topic/76427
https://stackoverflow.com/a/35039735
https://doc.lagout.org/programmation/Ruby/O%27Reilly%20Advanced%20Rails.pdf

TradeRESEARCH analysts draft financial research reports, that are then uploaded as flat HTML files within the `/tmp` directory.

```
#
# The following is a code snippet illustrating the use of insecure file canonical paths
#
def show_file
    f = File.open("/tmp/#{params[:file]}")
    @f = f.read
    render "show_file"​
end
```

To load the contents of a research report, the `params[:file]` variable is passed to Ruby's `File.open()` method, which creates a File instance represented by the file pathname. Note that in Alice's example the path name is set dynamically by appending the `params[:file]` to our directory path `/tmp/` which translates to `/tmp/filename`

Note that the research analysts save their research as HTML flat files in the `/tmp` directory with a standardized file naming convention e.g. 5543 , 5544 , 5545 etc

The contents of this file are then read by the `f.read` method and stored in the instance variable `f` and finally rendered by the `show_file` template.


Based on what we've seen in the source code, it doesn't look like the application is validating user supplied input which determines which file the application should read and then serve to the requesting user.

Try the following malicious input `../etc/passwd` in the file parameter, something like:

Interesting! Alice managed to access TradeRESEARCH's `/etc/passwd` file by simply appending `../` character in the file input !


The ability to traverse file paths and load arbitrary files from a system is called a directory (or path) traversal attack.

As with any user supplied input, it is important to ensure there is a context specific input validation strategy in place.

In the case of the TradeRESEARCH application, an obvious solution would be to first canonicalize the full path name and then secondly validating that the canonicalized path is in an intended/allowed directory on the file system.

Let's see how the above recommendation can be applied to our vulnerable example to remediate the directory traversal vulnerability.

```
def show_file
    fullpath = File.expand_path("/tmp/#{params[:file]}")
    if fullpath.index("/tmp/") != 0
        flash[:error] = 'Unauthorized Access'
        redirect_to articles_url
        return false
    else
        f = File.open("/tmp/#{params[:file]}")
        @f = f.read
        render "show_file"
    end
end
```

In our updated code fix, we make use of Ruby's `expand_path()` method which gets the full path string of Alice's file parameter by resolving the files relative path against the current directory, and further removes any relative pathing characters such as `./` and `../`


Finally, the path string returned by `expand_path()` method is checked by Ruby's `index()` method to ensure that Alice's file path begins with the `/tmp` path string. Should this check fail, the application will raise an `Unauthorized access` error and return, thus preventing Alice from loading files outside the `/tmp` directory structure.

Summary

For instance an attacker can gain access to the contents of sensitive system files (such as password stores, ssh keys, encryptions keys etc) or to download source code repositories, etc.
Consider also that retrieval of sensitive files is not a direct path to code-execution, it can be an indirect path (for instance consider the impact of the theft of an ssh authorized_keys file).
