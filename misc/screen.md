HEADER Intro to screen

# Running a program beyond a single SSH session

If you want to run a program on a remote server, you can use SSH. However, if your session were to quit, the program will be terminated. In order to run a program longer than your session, you need to use a multiplexer, such as GNU's [`screen`](https://linux.die.net/man/1/screen).

`screen` is not installed by default on Ubuntu, so you will need to first install it via `sudo apt install screen`

To start, run `screen`, and you will see a copyright page. Press `Enter` to continue, and you will then see a standard bash prompt. You can do whatever you would like inside this prompt, but with the one restriction that scrolling up does not work normally. To scroll up and down, you need to press `Ctrl-A`, and then `Esc`. This will put you in "Copy Mode", which you can then use the arrow keys to go up and down with. When you're done and want to leave "Copy Mode", you press `Esc` and it will bring you back to the prompt.

To then leave your `screen` session without killing any running process, you press `Ctrl-A` and then `d`. This will disconnect you from the `screen` instance and bring you back to the prompt that you ran `screen` in to get started.

To reconnect to a previous `screen` instance, run `screen -r`. If there is only one `screen` instance running, it will reconnect to that. If there are multiple, it will show you the names of them like so:

```
$ screen -r
There are several suitable screens on:
	1066.pts-8.bensalem	(04/11/2019 08:46:05 PM)	(Detached)
	1037.pts-8.bensalem	(04/11/2019 08:45:58 PM)	(Detached)
Type "screen [-d] -r [pid.]tty.host" to resume one of them.
```

to reconnect, you specficy the specific `screen` via `screen -r 1066.pts-8.bensalem`. To terminate a `screen`, enter it and then quit the prompt by typing `exit` or via `Ctrl-D`.

To list all running `screen` instances, you can list them with `screen -ls`.

You can also name a `screen` when creating it for easy reference, e.g. `screen -S MyScreen`. To reconnect to that `screen` later, you can use `-rS`, e.g. `screen -rS MyScreen`. It also supports unique partial matches, e.g. `screen -rS MyScreen`.

Finally, you can spawn a `screen` in detached mode via `-m <command>`. This is very useful for spawning a service, e.g. `screen -mdS <screen name> <command>`.
