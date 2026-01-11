---
title: 高通410随身WiFi：开启ADB，切卡密码，build.prop，改串，短信转发
date: 2025-10-20 12:00:00
index_img: https://pic1.imgdb.cn/item/68cc404ec5157e1a8817ddd9.png
tags:
  - 随身WiFi
  - 高通410
  - ADB
  - 切卡
  - 改串
  - 短信转发
categories:
  - 技术教程
---

# **开箱**

首先还是开箱，机子背面是 WiFi 和后台的基本信息。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135974.webp)

先给随身 WiFi 通电，然后连上它的 WiFi，登录后台看一下，确定没有问题就可以拆机了。

# **拆机**

机子背面有两个螺丝，拧掉这两颗螺丝，用工具把外壳撬开，可以看到它自带卡槽。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201123414.webp)

板号的丝印是: UFI103S_V05，UFI 开头的，基本确定就是高通的芯片。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135477.webp)

如果你感兴趣，背面的屏蔽罩，可以用小刀撬开，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201123335.webp)

正面的贴纸也可以撕开，可以看到具体的芯片型号。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136163.webp)

# **切卡**

好了，我们首先插入自己的 SIM 卡，它这个需要插入大卡。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135553.webp)

注意 SIM 卡的方向，不要插反了。

然后把随身 WiFi 插入电脑，电脑浏览器登录后台，可以在「高级设置 - SIM 卡」中进行切卡操作。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135484.webp)

这里切卡不需要密码，默认是 sim2，我们把它切换到 sim1。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201123111.webp)

如果你的设备切卡需要密码，可以使用 adb 命令获取到密码，也可以在备份系统时自己查看甚至修改密码，具体操作后面我会讲到。

切卡完成后可以看到，SIM 卡的信息变成了自己的卡（IMSI、ICCID），顶部的网络状态也可用了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136714.webp)

到这里你就可用正常使用随身 WiFi 了。

因为高通 410 芯片的随身 WiFi 安装的是安卓系统，我们可用很容易的拿到它的整个固件

获取各种信息并且进行修改，所以也就不用担心被厂家监控、限速。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135289.webp)

但也正是这个原因，随身 WiFi 的系统也很容易被我们自己搞坏「变砖」。

所以在开始「搞机」之前，最重要的就是备份，最好把整个固件都备份下来。

这样只要随身 WiFi 的硬件没有坏，那就可用通过备份的文件，把它恢复到初始状态。

提醒一下大家，整个备份操作会用到很多工具，有一些会被杀毒软件报毒，所以需要提前退出杀毒软件。

有条件的还是建议大家，可以在虚拟机中进行操作。

# **9008 模式**

想要备份整个设备固件，对于高通设备来说就是进入 9008 模式。

要进入 9008 模式，首先需要在电脑上安装驱动，这里用的是 vivo 的 9008 驱动。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135385.webp)

驱动安装完成以后。一般情况下，可以在按住 reset 复位键的同时，把随身 WiFi 插入电脑。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135639.webp)

这时候在电脑的「设备管理器 - 端口」下，就会出现一个 9008 的设备。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201123410.webp)

这就表示设备已经进入了 9008 模式。

或者如果你的设备默认开启了 adb，也可以直接在命令行中输入「adb reboot edl」。

其中「edl」的全拼是「Emergency Download Mode」，也就是 9008 模式。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135918.webp)

随后设备就会重启，自动进入 9008 模式。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135057.webp)

# **Miko 全量备份**

进入 9008 模式后，我们第一步先进行全量备份。

这时候需要用到一个软件叫做 miko，解压后运行 miko.exe 进行安装。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135819.webp)

安装位置根据自己的情况来选择，我这里就是默认一直下一步，安装完成以后，我们需要来到软件的安装目录。

可以直接在桌面快捷方式上右键，选择「属性」

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201123685.webp)

点击「打开文件所在位置」，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135492.webp)

然后把 Loader.exe 移动到安装目录，以后只需要运行这个启动器就可以了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135562.webp)

为了方便，可以右键把它发送到桌面，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135420.webp)

然后重命名为 miko。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135168.webp)

双击 miko 运行它。

我们的目的是备份整个固件，依次选择「Read - Partition Backup/Erase」。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135382.webp)

然后点击「Load Partition Structure」，来加载随身 WiFi 的固件内容。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135026.webp)

这里需要等待一会，可以在右边的窗口查看现在的状态。

当显示「SUCCESS」、固件的大小以及所用的时间，就表示读取成功了，软件中间也会显示了读取到的所有分区。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135494.webp)

然后我们全选所有分区，点击「Read Full Image」，选择备份文件的保存位置和文件名，这时候软件下方就会出现一个进度条。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135820.webp)

当进度条达到 100%，然后稍等一会，等右边的状态窗口显示「SUCCESS」、以及所用时间后就表示备份完成了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135507.webp)



这里在选择备份文件的保存位置时，也可以选择保存类型，有「.bin」和「.img」两种格式。

我试了一下，除了显示格式不同之外，并没有发现其它区别。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135181.webp)

文件大小一样，用压缩软件 7-zip 打开查看，里面包含的内容也都是一样的。

大家选择默认的就可以了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124857.webp)

# **Miko：备份恢复**

再来顺便说一下恢复的操作，依次选择「Flash - emmc block0 flasher」，双击选择备份文件，然后点击「FLASH！」，就可以完整恢复了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135679.webp)

# **QPT：分区备份**

使用 miko 我们已经备份了整个固件，现在我们还需要单独备份一些常用的小分区。

这些分区在后面会经常使用到，所以我们需要单独备份一下。

这时候就需要用到另一个软件「Qualcomm Premium Tool」，就简称 QPT 吧。

这个软件不需要安装，但是解压以后需要把文件夹名修改一下，不要包含中文，也不要放在中文的路径下。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135453.webp)

并且我们需要手动对它进行激活，在 QPT 目录中有一个 KEYGEN 程序。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135201.webp)

执行后可能需要安装「.NET Framework 3.5」，直接点击下载并安装就可以了。

安装完成以后，继续执行 KEYGEN 程序，点击「GenerateKey」生成一个 key 文件，取个名字后保存在任意位置。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136822.webp)

然后打开 QPT 软件，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135927.webp)

点击左上角的「Help - Activate」，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124437.webp)

选择刚刚生成的 key 文件，这样就激活成功了，激活后软件右下角会显示：Activated。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124769.webp)

下面我们进行分区的备份。

如果想要在更换系统后还能插 SIM 卡使用，我们就需要备份 Modem 相关分区。

在 QPT 软件中，依次选择「Qualcomm - partition」，然后勾选「Scan」，点击「Do Job」，这时候软件就会开始读取随身 WiFi 的分区信息。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135353.webp)

QPT 软件左侧的 Log 窗口，也会显示当前的状态，需要等一段时间。

当读取完成后，软件左下角会显示「process pass」字样，左侧 Log 窗口会显示「OK」，partition 列表也会显示出所有的分区，还会自动从「Scan」切换到「Backup」。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135522.webp)

现在就可以在列表中，选择我们需要备份的分区了。

比如这里选择 1 号 modem 分区，点击「Do Job」，选择文件的保存位置后，就开始备份了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135571.webp)

同样的，通过观察左侧 Log 窗口与左下角的信息，就可以确定现在的状态。

用相同的操作，依次备份一下：modem，modemst1，modemst2，fsg 分区。其中「modem 分区」生成的备份文件名为「NON-HLOS.bin」。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135024.webp)

当然了，在 QPT 中我们也可以一键备份所有的分区。

具体的操作，就是在读取到所有分区的信息后，不去选择具体的某一个分区，而是直接勾选右侧的「Backup All」，然后直接「Do Job」执行，这时候它就会把所有的分区都备份下来。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135952.webp)

与 miko 的全量备份不同的是，QPT 的全备份是把每个分区存储为单个文件，而 miko 是打包在一个文件中。

用 7-zip 软件打开 miko 备份的文件后，可以发现里面的分区其实是一样的。

# **QPT：恢复备份**

再来看一下 QPT 的恢复操作。

与备份操作一样，还是首先在分区列表中选择需要恢复的分区，然后是勾选「Write」，然后 「Do Job」就可以了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135128.webp)

9008 模式下的备份操作到这里就结束了。

这里有一点需要注意，就是在 9008 模式下，软件好像只能读取一次设备的分区信息。

也就是 miko 中的「Load Partition Structure」与 QPT 中的「Scan」操作如果第二次进行读取操作，一般都会失败。这时候只需要拔掉随身 WiFi，重新进入 9008 模式就可以了。

# **ROOT**

备份完分区后，我们最好再来备份一下 QCN 文件，QCN 是 Qualcomm Calibration Network 的缩写，是用于存储和管理高通芯片基带模块的校准数据，而基带模块影响的就是设备的通信问题。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135559.webp)

但是备份和恢复 QCN 文件，设备必须要有超级用户权限，也就是 root 权限，所有我们首先需要 root 随身WiFi。

这里我们需要用到安卓远程桌面软件 ARDC，解压后即可直接使用。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135390.webp)

首先需要确定随身 WiFi 开启了 adb，但是因为 ARDC 软件会使用自带的 adb 程序，所以如果之前使用过 adb 命令，有可能会发生冲突，可以在任务管理器中，找到已有的 adb.exe 后台进程，选中后右键「结束任务」，之后就可用直接运行 ARDC.exe。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124463.webp)

当成功连接后就会显示这个设置页面，跟安卓手机一样，可用直接在其中查看设备的各种信息。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135947.webp)

为了后续的操作，我们需要安装几个 APP。

首先是桌面，也就是「Launcher.apk」。

在 ARDC 中安装 APP 很简单，只需要把 apk 文件拖进去就可以了，当显示 Success 就表示安装完成。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135916.webp)

可以用同样的方法，安装「ES 文件浏览器」与「Magisk 面具」应用。

安装完成后，在 ARDC 中点击鼠标右键，也就是返回操作，这时候会让你选择桌面程序。

我们选择刚才安装的「Launcher」后，点击「始终」按钮，就可以来到熟悉的桌面了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135828.webp)

下面进行 root 操作。

因为之前在分区备份中，已经备份了 boot 分区，所以可以直接利用 Magisk 修补这个 「boot.img」，然后重新刷入到随身 WiFi 就可以了。

所以我们首先把「boot.img」拖入到 ARDC 中，根据提示可以知道，它被保存在了 「/sdcard/Download」文件夹中。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135852.webp)

然后打开 Magisk 应用，当前的状态是：无法获取。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135067.webp)

点击「安装 - 下一步 - 方式：选择并修补一个文件」，在跳出的路径中选择「Download」，选中刚才上传的「boot.img」，选择「标准安卓方式」，然后「开始」，当显示「完成！」后，可以看到修补后的 img 文件，也被保存在了 Download 文件夹中。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136649.webp)

鼠标右键返回到桌面，然后打开「ES文件管理器」，来到 「下载」也就是「Download」目录中，长按鼠标左键选中修补后的 img 文件，选择下方的 「重命名」操作，取一个方便一些的名称。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135758.webp)

我这里修改为「magiskboot.img」，然后我们需要把这个文件传到电脑中。

可以直接在 ARDC 右上角选择箭头「>>」，打开自带的 adb 命令窗口，在 CMD 中输入下面的命令后回车「adb pull /sdcard/Download/magiskboot.img」，也就是把修补后的文件拉取到 ARDC 所在的目录。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135807.webp)

传输完成后，就可以在 ARDC 的目录中找到「magiskboot.img」。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136777.webp)

这时候，只需要把这个修补后的 boot 文件，重新刷入到随身 WiFi 中。

可以使用之前的 QPT 软件恢复 boot 分区，也可以直接使用 adb 命令，用「adb reboot bootloader」，让随身WiFi重启后进入 fastboot 模式，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135864.webp)

然后「fastboot flash boot magiskboot.img」。写入完成后，使用「fastboot reboot」重启设备。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124533.webp)

最后还是来到 ARDC ，打开 Magisk 应用，可以看到当前的 Migisk 版本号，并且最下面显示了这个按钮浮窗，就表示设备已经 root 成功了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135444.webp)

为了后续 QCN 的顺利备份，我们首先要给命令行 shell 授予 root 权限。

在 CMD 中输入「adb shell su」，回车后 ARDC 中会显示超级用户请求弹窗，只需要在倒计时结束前点击「允许」即可。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136898.webp)

如果错过了，也可以在 Magisk 中，来到下方的「盾牌」页面，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135884.webp)

重新给 Shell 授权超级用户权限。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124715.webp)

# **QPST：QCN 备份**

好了，下面就进行 QCN 的备份，可以使用 QPST 软件。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135748.webp)

解压后进行安装，安装完成后在开始菜单选择 「QFIL」打开。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135224.webp)

这里需要连接设备的 901D 端口，所以我们要在命令行中输入「adb shell su」、「setprop sys.usb.config diag,adb」。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135137.webp)

执行后查看设备管理器，就会在端口中看到 901D 设备。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135256.webp)

然后在 QFIL 中点击「SelectPort」，选择识别到的设备。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135541.webp)

选择「Tools - QCN Backup Restore」，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136867.webp)

这里需要选择备份文件，我们可以提前创建一个空的「.qcn」文件，然后在「QCN Backup Restore」中选择它，点击「Backup QCN」，就开始备份了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201124212.webp)

恢复操作也是类似的。

只需要选择 .qcn 文件后，点击「Restore QCN」即可。

# **星海 SVIP：备份 QCN** 

备份 QCN 也可以使用「星海 SVIP」软件。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201136299.webp)

这里简单介绍一下，星海 SVIP 解压后即可直接运行。

首先选择「高通」，然后点击「联机」，就可以获取到设备的基本信息。

备份前同样要开启 901D 端口。

在 星海SVIP 中可以直接选择「高通强开」，然后「一键执行」，左侧窗口显示端口开启成功，在设备管理器中也看到了 901D 设备。

继续选择「备份QCN，一键执行」，选择保存的位置，输入文件名后就开始备份了。

恢复操作同理，打开 901D 端口后，选择「写入QCN，一键执行」即可。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201135958.webp)

这里再提醒一下大家，我备份 QCN 的过程中，因为我没有插 SIM 卡，随身 WiFi 自动重启了。长时间没有信号它就会自动重启，这时候备份的 QCN 就不是完整的，但是软件并不会提醒。所以建议大家在备份时，注意观察一下随身 WiFi 的状态，或者**多备份几次，确定备份的「.qcn」文件大小一致即可**。

上一篇文章主要是对高通芯片的随身 WiFi 进行了各种备份操作。

但是其中可能会存在一些问题，比如：

设备不激活，没 wifi？

切卡需要密码？

密码不知道？

设备默认没有开启 adb？

怎么进行改串？

怎么转发短信等等？

今天就跟大家分享一下解决这些问题的方法。

# **build.prop**

如果你用过随身 WiFi 助手，会发现它里面有一个「01. 设备信息」，可以获取到设备的一些基本信息。

这里面的设备序列号，和通过「adb devices 命令」查询到的是一样的。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125200.webp)

而其中大部分信息，也都是通过「getprop」命令获取到的。

通过「adb shell」进入设备命令行，然后输入「getprop」命令可以看到会有很多属性。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201131806.webp)

为了快速过滤，也可以在 getprop 后面接上「| grep xxx」，就会过滤出只包含 grep 后面字符串的内容。

比如这里使用「grep ro.build」，就会在输出信息中看到只包含「ro.build」的属性。

这其中就包含系统版本、cpu 型号、安卓版本等等。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201132223.webp)

而使用「grep ufi」，就会展示随身 WiFi 的各种配置信息，比如设备的切卡密码、后台登录密码等。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125942.webp)

而「getprop」命令所获取的大部分信息，其实都是从「build.prop」文件中获取到的。

它里面存储了设备的各种配置信息，当系统启动时就会加载和应用这些配置。

而「build.prop」文件就存放在我们之前备份过的「system.img」分区。

可以使用压缩软件「7-zip」打开「system」分区文件。

这里面有三个「build.prop」文件，分别是：

system 分区根目录中的 build.prop

system 分区根目录中的 build.prop.bakforspec

system 分区下的 /vendor/Default/system/build.prop

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201132350.webp)

这三个文件中的内容几乎都是一样的。

正常情况下应用的应该还是根目录下的「build.prop」。

根据名称和所在的目录我猜测「build.prop.bakforspec」应该是一个备份文件，可能在设备恢复出厂时会应用里面的配置。

而 vendor 目录中的「build.prop」文件里面应该大部分都是设备厂商自己的一些配置。

当然也可以直接在设备的「adb shell」中，进入 system 文件夹，这里面也会找到 build.prop 文件，目录结构与 system.img 镜像文件是一样的。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125866.webp)

使用「ls -l」命令，可以看到对于一般用户「build.prop」文件的权限是只读，只有 root 用户才有写权限。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125988.webp)

所以我们查看和修改「build.prop」文件，只需要从 system.img 中解压出来即可。

为了确保配置信息不冲突，需要把三个「build.prop」文件都解压出来，一起修改。

这里以开启 adb 为例，用记事本打开「build.prop」文件，找到含有 sys.usb.config 的配置项，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125971.webp)

如果你的设备没有开启 adb，就在最后添加「, adb」即可。

同样的操作把三个「build.prop」文件都修改了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125361.webp)

然后打开「DiskGenius」软件，把「system.img」镜像文件拖进去，选中「镜像分区」，切换到「浏览文件」，然后依次把刚才修改过的「build.prop」文件，拖到对应的位置，直接替换即可。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133529.webp)

替换完成后，把设备进入 9008 模式，用 QPT 软件恢复 system 分区，恢复完成后重新插拔随身 WiFi，重启后 adb 就会打开了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125612.webp)

build.prop 中的其它配置也是同理，比如 WiFi 名称，WiFi密码，后台地址。

这些都可以根据属性名称推测出它的作用，比如 sim.count=2，如果把它改成 1，那后台的切卡页面就只会显示一个 sim1。

simsw=1 是「sim switch」支持切卡操作，如果改成 0 那后台就直接没切卡页面。

simsw_pw=0 是「sim switch password」切卡不需要密码，改成 1 就需要密码。

而切卡密码也可以直接在 simswitchpword 这里面进行查看和修改。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133736.webp)

而且大部分设备默认是开启 adb 的，就可以直接使用「adb reboot bootloader」进入 fastboot 模式。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201125643.webp)

然后用「fastboot flash system system.img」，刷入修改后的 system 分区。

刷写完成后 fastboot reboot 重启就可以了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126052.webp)

# **改串**

imei 串号与设备是一一对应的。

我不用商家的流量，又担心厂商有其它手段可以定位设备，所以能改就改了吧。

对于 410 芯片的随身 WiFi，它的 imei 信息就保存在之前备份的 QCN 文件中。

可以直接通过星海 SVIP 软件进行改串操作。

来到星海SVIP软件，选中「高通 - 联机 - 选中打开原机 QCN- 一键执行」。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126619.webp)

选择之前备份的 qcn 文件打开，就会在左侧窗口看到设备的串号。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126552.webp)

然后勾选「一键改写 QCN」，在串号 1 与串号 2 中都填写要修改的 imei 号。

imei 号是 15 位数字，可以随便填写，也可以在原有的串号上稍加修改。

填写完成后点击「一键执行」，然后会提示修改后的 QCN 文件保存位置。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133775.webp)

然后就是恢复 qcn 的操作。

上一篇文章已经提到过，就是先执行「高通强开 1 - 写入 QCN - 一键执行」，等待 QCN 导入完成就可以了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133869.webp)

除了使用星海 SVIP 以外，还可以直接使用 am 命令进行修改。

在命令行中进入「adb shell su」，然后执行下面的命令：

「am broadcast -a elink.action.limitSpeed --es imei xxxxxx」

命令中 imei 后面就是要修改的串号（15 位），然后重启设备即可。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126582.webp)

但是我的设备，板号丝印为 UFI103S_V05，在改完 imei 号后，进入后台会发现 4G 网络掉线。

稍等一会 WiFi 图标也会变红，提示 WiF 热点已关闭，手动打开也不起作用，还是会自动关闭。

打开 ARDC 远程桌面（投屏），会发现随身 WiFi 会自动进入飞行模式，也无法手动退出。

要解决这个问题，还是需要修改 build.prop 文件，找到「persist.ufi.ft.only_sn=1」，把 1 改成 0。

下面还有一个「nosignal.reboot=yes」，表示没信号时，几分钟后设备就会重启。

如果你不想让它重启也可以改成 no，修改完成后重新刷入 system 分区就可以了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126532.webp)

我这里还尝试了直接将修改后的 build.prop 文件，push 到随身 WiFi 中，

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126114.webp)

然后 su 切换到 root 用户，使用 cp 命令把修改后的 build.prop 文件，直接复制到 system 文件夹中替换。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126395.webp)

用 cat 命令查看确实已经修改了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133998.webp)

然后 adb reboot 重启设备，也可以达到同样的效果。

最后成功修改了 IMEI 串号，随身 WiFi 也能正常使用。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126386.webp)

# **短信转发**

有些小伙伴使用随身 WiFi，可能还有短信转发的需求，我这里也简单的介绍一下。

打开 ARDC 软件，然后安装短信转发器（smsforwarder）应用，安装完成后打开。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133459.webp)

首先来到「发送通道」，点击右上角的「+」号。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126212.webp)

选择一个转发短信的途径，我这里选择的是电子邮箱，其它的大家可以自行尝试。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133478.webp)

> 它的原理就是短信转发器，在后台检测到 sim 卡收到了短信，然后就利用你授权登录的账号，给你指定的接收账号发送消息。

以电子邮箱为例，随便填写一个名称，发送邮箱填写发邮件的邮箱地址，登录密码一般是填写授权码。

我用的是 QQ 邮箱，需要你登录 QQ 邮箱，在设置中找到 POP3/IMAP/SMTP 相关的设置，开启后就可以管理授权码。

官方也都会有相应的教程。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126631.webp)

发件人昵称随便填写，收件地址就是接收信息的邮件地址，可以跟发件邮箱是同一个（自己给自己发），还可以同时填写多个邮箱地址，邮件主题可以直接从下面选择标签。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133441.webp)

填写完成后点击「测试」。只要账号和密码都填写正确，这时候你的收件邮箱就会收到一条测试邮件。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201133129.webp)

保存后来到「转发规则」，同样是点击右上角的「+」号。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126126.webp)

发送通道选择刚才创建的，然后默认匹配全部卡槽。

反正我们也就只有一张 sim 卡，默认匹配全部字段，就是所有短信都转发。

当然你也可以选择只转发「指定的手机号、短信内容」等等。

点击右下角的测试，随便填写一个号码和短信内容测试一下，能收到对应的邮件就表示配置成功了。

![img](https://cdn.bili33.top/gh/miku8miku/images@main//202510201126541.webp)

我使用的是电信卡，测试邮件我都成功收到了。

但是最后用其它手机给它发短信，却怎么也收不到。

网上查了一下，好像说是不支持电信，只支持联通和移动，有需求的小伙伴可以自己尝试一下。

# **附件**

工具集合：https://www.aliyundrive.com/s/Ku3vwAk5GaU

备份文件：https://www.aliyundrive.com/s/6xxk1yk47s7