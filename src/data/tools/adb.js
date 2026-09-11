export const adb = {
    id: "adb",
    name: "Android Debug Bridge (ADB)",
    category: "Utilities",
    color: "#3ddc84",
    accentClass: "adb-accent",
    github: "https://github.com/aosp-mirror/platform_system_core",
    tagline: "Versatile command-line tool to communicate with Android devices.",
    description:
      "Android Debug Bridge (adb) is a versatile command-line tool that lets you communicate with a device. The adb command facilitates a variety of device actions, such as installing and debugging apps, running shells, transferring files, and viewing system logs.",
    install: {
      windows: "winget install -e --id Google.Adk.PlatformTools",
      mac: "brew install android-platform-tools",
      linux: "sudo apt install android-tools-adb",
    },
    visualConcept: {
      title: "ADB Architecture",
      steps: [
        {
          name: "ADB Client",
          desc: "Command line terminal on your PC sending user instructions.",
          status: "modified",
        },
        {
          name: "ADB Server",
          desc: "Background process on your PC coordinating client-device requests.",
          status: "staged",
        },
        {
          name: "ADB Daemon (adbd)",
          desc: "Background process running on the connected Android device/emulator.",
          status: "committed",
        },
        {
          name: "Device Shell",
          desc: "Secure Unix shell inside the Android OS executing system level commands.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "ADB Command Architect",
      description:
        "Configure parameters to generate ADB commands for device tracking, file management, app execution, and logcat monitoring.",
      options: [
        {
          id: "action",
          label: "Action Type",
          type: "select",
          defaultValue: "devices",
          choices: [
            { value: "devices", label: "List Connected Devices" },
            { value: "install", label: "Install App (APK)" },
            { value: "uninstall", label: "Uninstall App (Package)" },
            { value: "push", label: "Push File to Device" },
            { value: "pull", label: "Pull File from Device" },
            { value: "shell", label: "Run Shell Command" },
            { value: "logcat", label: "View Device Logs (Logcat)" },
            { value: "reboot", label: "Reboot Device" },
          ],
        },
        {
          id: "targetDevice",
          label: "Target Device Serial (-s) (optional)",
          type: "text",
          defaultValue: "",
        },
        {
          id: "apkPath",
          label: "APK File Path",
          type: "text",
          defaultValue: "app-debug.apk",
          condition: (opts) => opts.action === "install",
        },
        {
          id: "packageId",
          label: "App Package ID",
          type: "text",
          defaultValue: "com.example.myapp",
          condition: (opts) => opts.action === "uninstall",
        },
        {
          id: "localPath",
          label: "Local File Path",
          type: "text",
          defaultValue: "photo.jpg",
          condition: (opts) => opts.action === "push" || opts.action === "pull",
        },
        {
          id: "remotePath",
          label: "Remote File Path (on device)",
          type: "text",
          defaultValue: "/sdcard/Pictures/",
          condition: (opts) => opts.action === "push" || opts.action === "pull",
        },
        {
          id: "shellCmd",
          label: "Shell Command",
          type: "text",
          defaultValue: "pm list packages",
          condition: (opts) => opts.action === "shell",
        },
        {
          id: "logFilter",
          label: "Logcat Filter (Tag:Priority)",
          type: "text",
          defaultValue: "ActivityManager:I *:S",
          condition: (opts) => opts.action === "logcat",
        },
        {
          id: "rebootMode",
          label: "Reboot Mode",
          type: "select",
          defaultValue: "normal",
          choices: [
            { value: "normal", label: "Normal Reboot" },
            { value: "recovery", label: "Recovery Mode" },
            { value: "bootloader", label: "Bootloader (Fastboot)" },
          ],
          condition: (opts) => opts.action === "reboot",
        },
      ],
      generator: (opts) => {
        const deviceFlag = opts.targetDevice ? `-s ${opts.targetDevice} ` : "";
        switch (opts.action) {
          case "devices":
            return {
              command: `adb devices`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                {
                  part: "devices",
                  desc: "Queries the ADB server and lists all currently connected emulator or physical Android devices.",
                },
              ],
            };
          case "install":
            return {
              command: `adb ${deviceFlag}install ${opts.apkPath || "app-debug.apk"}`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific connected device with this serial number.",
                      },
                    ]
                  : []),
                {
                  part: "install",
                  desc: "Pushes the target application APK package to the device and performs installation.",
                },
                {
                  part: opts.apkPath || "app-debug.apk",
                  desc: "Local path of the installation APK package file.",
                },
              ],
            };
          case "uninstall":
            return {
              command: `adb ${deviceFlag}uninstall ${opts.packageId || "com.example.myapp"}`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific device.",
                      },
                    ]
                  : []),
                {
                  part: "uninstall",
                  desc: "Instructs the device package manager to uninstall the given app package.",
                },
                {
                  part: opts.packageId || "com.example.myapp",
                  desc: "The unique bundle identifier or package name of the app to delete.",
                },
              ],
            };
          case "push":
            return {
              command: `adb ${deviceFlag}push ${opts.localPath || "photo.jpg"} ${opts.remotePath || "/sdcard/Pictures/"}`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific device.",
                      },
                    ]
                  : []),
                {
                  part: "push",
                  desc: "Copies specified file or folder from host machine to device storage.",
                },
                {
                  part: opts.localPath || "photo.jpg",
                  desc: "The source file or folder path on the local PC.",
                },
                {
                  part: opts.remotePath || "/sdcard/Pictures/",
                  desc: "The target destination path inside the connected Android device filesystem.",
                },
              ],
            };
          case "pull":
            return {
              command: `adb ${deviceFlag}pull ${opts.remotePath || "/sdcard/Pictures/"} ${opts.localPath || "photo.jpg"}`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific device.",
                      },
                    ]
                  : []),
                {
                  part: "pull",
                  desc: "Retrieves a file or directory from the device filesystem back to the host machine.",
                },
                {
                  part: opts.remotePath || "/sdcard/Pictures/",
                  desc: "The source file/folder path on the device.",
                },
                {
                  part: opts.localPath || "photo.jpg",
                  desc: "The destination file/folder path on the host computer.",
                },
              ],
            };
          case "shell":
            return {
              command: `adb ${deviceFlag}shell "${opts.shellCmd || "pm list packages"}"`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific device.",
                      },
                    ]
                  : []),
                {
                  part: "shell",
                  desc: "Executes a Unix shell command payload directly on the connected device's operating system.",
                },
                {
                  part: `"${opts.shellCmd || "pm list packages"}"`,
                  desc: "The shell command string parameter sent to the device for execution.",
                },
              ],
            };
          case "logcat":
            return {
              command: `adb ${deviceFlag}logcat ${opts.logFilter || "ActivityManager:I *:S"}`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific device.",
                      },
                    ]
                  : []),
                {
                  part: "logcat",
                  desc: "Streams real-time device logs. Allows filtering by process, tag, or log severity.",
                },
                {
                  part: opts.logFilter || "ActivityManager:I *:S",
                  desc: "Log filter parameters to isolate specific debug logs and suppress others.",
                },
              ],
            };
          case "reboot": {
            const rebootType =
              opts.rebootMode === "normal" ? "" : ` ${opts.rebootMode}`;
            return {
              command: `adb ${deviceFlag}reboot${rebootType}`,
              explanation: [
                {
                  part: "adb",
                  desc: "Invokes the Android Debug Bridge command line tool.",
                },
                ...(opts.targetDevice
                  ? [
                      {
                        part: `-s ${opts.targetDevice}`,
                        desc: "Directs the command to the specific device.",
                      },
                    ]
                  : []),
                {
                  part: `reboot${rebootType}`,
                  desc: `Triggers a hardware power cycle. ${opts.rebootMode === "normal" ? "Restarts device back to normal Android OS." : opts.rebootMode === "recovery" ? "Reboots device into Recovery UI." : "Reboots device into Bootloader (Fastboot) mode."}`,
                },
              ],
            };
          }
          default:
            return { command: "adb --help", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const serial = opts.targetDevice || "emulator-5554";
        switch (opts.action) {
          case "devices":
            return `List of devices attached\n${serial}\tdevice\n192.168.1.102:5555\tdevice`;
          case "install":
            return `Performing Streamed Install\nSuccess`;
          case "uninstall":
            return `Success`;
          case "push":
            return `${opts.localPath || "photo.jpg"}: 1 file pushed, 0 skipped. 18.5 MB/s (102456 bytes in 0.005s)`;
          case "pull":
            return `${opts.remotePath || "/sdcard/Pictures/"}: 1 file pulled, 0 skipped. 15.2 MB/s (102456 bytes in 0.006s)`;
          case "shell":
            if (opts.shellCmd === "pm list packages") {
              return `package:android\npackage:com.android.providers.telephony\npackage:com.android.providers.contacts\npackage:com.google.android.youtube\npackage:${opts.packageId || "com.example.myapp"}`;
            }
            return `\x1b[32m[Executing shell: ${opts.shellCmd}]\x1b[0m\nuid=2000(shell) gid=2000(shell) groups=2000(shell),1004(input),3003(inet)\n`;
          case "logcat":
            return `\x1b[36m--------- beginning of main\x1b[0m\n06-17 09:55:01.214  1420  1450 I ActivityManager: Start proc 12455:com.android.chrome/u0a115 for service\n06-17 09:55:01.442  1420  1460 I ActivityManager: Displayed com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity: +210ms\n\x1b[33m[Streaming logcat... Press Ctrl+C to terminate]\x1b[0m`;
          case "reboot":
            return `\x1b[31mRebooting device ${serial} (${opts.rebootMode || "normal"}) ...\x1b[0m\nDevice connection terminated.`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        section: "Connection & Discovery",
        items: [
          { cmd: "adb kill-server", desc: "Kill the ADB server process." },
          { cmd: "adb start-server", desc: "Start the ADB server process." },
          { cmd: "adb devices", desc: "List attached devices." },
          { cmd: "adb devices -l", desc: "List connected devices with product/model info." },
          { cmd: "adb connect <ip_address>", desc: "Connect to a device over Wi-Fi." },
          { cmd: "adb disconnect", desc: "Disconnect from all TCP/IP connected Android devices." },
          { cmd: "adb usb", desc: "Restart ADB listening on USB." },
          { cmd: "fastboot devices", desc: "Check connection and list devices in bootloader mode." },
        ],
      },
      {
        section: "Device Rebooting",
        items: [
          { cmd: "adb reboot", desc: "Reboot the device normally." },
          { cmd: "adb reboot recovery", desc: "Reboot device into recovery mode." },
          { cmd: "adb reboot-bootloader", desc: "Reboot device into bootloader/fastboot mode." },
          { cmd: "adb root", desc: "Restart adbd with root permissions." },
        ],
      },
      {
        section: "App & Package Management",
        items: [
          { cmd: "adb install path/to/app.apk", desc: "Install an app." },
          { cmd: "adb install -r app.apk", desc: "Reinstall/upgrade an existing app, keeping its data." },
          { cmd: "adb uninstall com.myAppPackage", desc: "Uninstall an app." },
          { cmd: "adb uninstall -k com.myAppPackage", desc: "Uninstall app without deleting data." },
          { cmd: "adb shell pm clear com.example.app", desc: "Delete all data associated with a package." },
          { cmd: "adb shell pm list packages", desc: "List all package names." },
          { cmd: "adb shell pm list packages -3", desc: "List third-party package names." },
          { cmd: "adb shell pm list packages -s", desc: "List only system packages." },
          { cmd: "adb shell pm list packages -u", desc: "List package names including uninstalled ones." },
          { cmd: "adb shell dumpsys package packages", desc: "List detailed info on all apps." },
          { cmd: "adb shell path com.example.app", desc: "Print the path to the APK file for a package." },
        ],
      },
      {
        section: "Permissions",
        items: [
          { cmd: "adb shell pm grant [packageName] [Permission]", desc: "Grant a permission to an app." },
          { cmd: "adb shell pm revoke [packageName] [Permission]", desc: "Revoke a permission from an app." },
          { cmd: "adb shell pm reset-permissions -p [packageName]", desc: "Reset permissions for a specific app." },
        ],
      },
      {
        section: "File Management",
        items: [
          { cmd: "adb push [source] [destination]", desc: "Copy files from your computer to your phone." },
          { cmd: "adb pull [device_location] [local_location]", desc: "Copy files from your phone to your computer." },
          { cmd: "adb shell ls -s", desc: "List directory contents with sizes." },
          { cmd: "adb shell ls -R", desc: "List subdirectories recursively." },
        ],
      },
      {
        section: "Activity Manager (Intents)",
        items: [
          { cmd: "adb shell am start -a android.intent.action.VIEW", desc: "Start an activity with VIEW action." },
          { cmd: "adb shell am start -a android.intent.action.VIEW -d URL", desc: "Open a URL." },
          { cmd: "adb shell am broadcast -a 'my_action'", desc: "Send a broadcast intent." },
          { cmd: "adb shell am start -a android.intent.action.CALL -d tel:+123456789", desc: "Make a phone call." },
          { cmd: "adb shell am start -W -c android.intent.category.HOME -a android.intent.action.MAIN", desc: "Go to Home screen." },
        ],
      },
      {
        section: "Input & Key Events",
        items: [
          { cmd: "adb shell input text 'hello'", desc: "Print text into the focused input field." },
          { cmd: "adb shell input keyevent 3", desc: "Simulate Home button." },
          { cmd: "adb shell input keyevent 4", desc: "Simulate Back button." },
          { cmd: "adb shell input keyevent 26", desc: "Toggle Power button (Turn device ON/OFF)." },
          { cmd: "adb shell input keyevent 66", desc: "Simulate Enter key." },
          { cmd: "adb shell input keyevent 67", desc: "Simulate Delete/Backspace key." },
          { cmd: "adb shell monkey -p com.myAppPackage -v 10000 -s 100", desc: "Generate 10,000 random events on the device (Monkey testing)." },
        ],
      },
      {
        section: "Screen & UI",
        items: [
          { cmd: "adb shell screencap -p /sdcard/screenshot.png", desc: "Capture a screenshot." },
          { cmd: "adb shell screenrecord /sdcard/demo.mp4", desc: "Record the device screen." },
          { cmd: "adb shell wm size 2048x1536", desc: "Emulate device resolution/size." },
          { cmd: "adb shell wm density 288", desc: "Emulate device screen density." },
          { cmd: "adb shell wm size reset", desc: "Reset screen resolution to default." },
        ],
      },
      {
        section: "Debugging, Logs & System Info",
        items: [
          { cmd: "adb logcat", desc: "View device logs." },
          { cmd: "adb logcat -c", desc: "Clear/flush the active device logcat buffer." },
          { cmd: "adb logcat -d > log.txt", desc: "Save the logcat output to a file." },
          { cmd: "adb bugreport > bugreport.zip", desc: "Dump whole device information (dumpstate, dumpsys, logcat)." },
          { cmd: "adb shell getprop ro.build.version.release", desc: "Get device Android OS version." },
          { cmd: "adb get-serialno", desc: "Get the serial number." },
          { cmd: "adb shell dumpsys battery", desc: "Display device battery metrics." },
          { cmd: "adb shell dumpsys battery set level <n>", desc: "Change the emulated battery level (0-100)." },
        ],
      },
      {
        section: "Backup & Restore",
        items: [
          { cmd: "adb backup -apk -all -f backup.ab", desc: "Backup settings and apps to a file." },
          { cmd: "adb restore backup.ab", desc: "Restore a previous backup to your phone." },
          { cmd: "adb sideload", desc: "Push and flash custom ROMs and zips from your computer." },
        ],
      },
      {
        section: "Shared Preferences",
        items: [
          { cmd: "adb shell 'am broadcast -a org.example.app.sp.PUT --es key key_name --es value \"hello world!\"'", desc: "Add a string value to default shared preferences." },
          { cmd: "adb shell 'am broadcast -a org.example.app.sp.REMOVE --es key key_name'", desc: "Remove a value from default shared preferences." },
          { cmd: "adb shell 'am broadcast -a org.example.app.sp.CLEAR --es key key_name'", desc: "Clear all default shared preferences." },
        ],
      },
      {
        section: "Advanced Batch Commands",
        items: [
          { cmd: "adb devices | tail -n +2 | cut -sf 1 | xargs -I X adb -s X install -r app.apk", desc: "Install an app on ALL connected devices." },
          { cmd: "adb devices | tail -n +2 | cut -sf 1 | xargs -I X adb -s X uninstall com.example.app", desc: "Uninstall an app from ALL connected devices." },
          { cmd: "adb devices | tail -n +2 | cut -sf 1 | xargs -I X adb -s X shell getprop ro.build.version.release", desc: "Print Android version of ALL connected devices." },
        ],
      },
    ],
  };
