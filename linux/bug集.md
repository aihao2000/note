# bug集

## 开机显示ACPI Error以及ACPI BIOS Error(bug)

```shell
ACPI BIOS Error(bug):Could not resolve symbol [\SB.PR00._CPC]
AE_NOT_FOUND
ACPI Error:Aborting method \_SB.PR00._CPC due to previous error (AE_NOT_FOUND)
```

显卡驱动问题，更换显卡驱动版本解决

## 操作系统时间不正确

```shell
sudo apt-get install ntp # 使用ntp服务自动同步时间
server time.nist.gov # 这个配置将ntp服务配置为从time.nist.gov服务器获取时间。
sudo service ntp start
sudo update-rc.d ntp defaults # 将ntp服务添加到系统启动项中，以确保每次系统启动时自动启动ntp服务
```



