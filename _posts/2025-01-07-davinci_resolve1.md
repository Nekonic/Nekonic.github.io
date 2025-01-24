---
layout: post
title: davinci resolve GPU initialization error
categories: davinci_resolve
tags: davinci_resolve error
---
## 설치부터 오류가 일어났다..
다빈치 리졸브를 설치하려는데, 설치부터 해쉬값이 안맞아서 설치 자체가 안되는 오류가 발생했지만 얼마 지나고 해결됨.  
소스를 까보니 누군가가 해쉬값을 포함한 설정값을 베타버전것을 업데이트 안하고 넣어버림..  
  
설치 후, 열어보니 GPU initialization Error가 발생함.  

## 현재 상황.
- davinci-resolve 19.1.2-1
- opencl-nvidia 565.77-3

```bash
$ python davinci-resolve-checker.py
Using locale en_US
DaVinci Resolve checker 5.2.8
Installed DaVinci Resolve package: davinci-resolve 19.1.2-1
Chassis type: desktop
Installed OpenCL drivers:
        opencl-nvidia 565.77-3
Presented GPUs:
        TU116 [GeForce GTX 1660] (kernel driver in use: nouveau)
OpenGL vendor string: Mesa
OpenGL renderer string: NV168
clinfo detected platforms and devices:
        Warning: could not parse clinfo data!

Not found opencl platforms with appropriate GPUs. Check that you have installed corresponding driver. Otherwise you cannot run DR.
You are not using nvidia as kernel driver. Use proprietary nvidia driver, otherwise you could not use DaVinci Resolve.
```

## Troubleshooting
간단하게 nvidia 드라이버 설치로 해결할 수 있다!  

```bash
$ sudo pacman -S nvidia nvidia-utils nvidia-settings
```

### GPU가 다른 프로세서(예: 게임)를 인식하지 못하는 오류.
예를들어 마인크래프트가 켜지지 않거나, OSU!를 켠 상태가 원래 200프레임이였는데, 13프레임으로 떨어진다거나 하는 상황이 되었다.  

[참고](https://www.reddit.com/r/Fedora/comments/w2z92o/glfw_error_65542_glx_no_glxfbconfigs_returned/?rdt=52776)

간단하게 이것을 설치해주면 해결된다.  
```bash
$ sudo pacman -S glfw
```

### 패키지 설치중 오류(sha1)
```bash
==> Validating source files with sha256sums...
    DaVinci_Resolve_19.1.2_Linux.zip ... FAILED
==> ERROR: One or more files did not pass the validity check!
 -> error making: davinci-resolve-exit status 1
 -> Failed to install the following packages. Manual intervention is required:
davinci-resolve - exit status 1
```

말 그대로 검증과정에서 생긴 오류다.  
해쉬값이 맞지 않기 때문에 벌어지는데,  

```bash
yay -S --mflags --skipinteg davinci-resolve
```

이런식으로 우회할 수 있다.  
  
물론 해쉬값을 안다면 PKGBUILD 파일에서 간단하게 바꾸기만 하면 설치가 가능하다.  

### 패키지 설치중 오류

업데이트 또는 재설치를 하려고 하면, 
```bash
chmod: cannot access '/home/nekonic/.cache/yay/davinci-resolve/src/DaVinci_Resolve_19.1.2_Linux.run': No such file or directory
```
이런 말이 뜰 때가 있다.  

직접 .cache/yay/davinci-resolve 로 가보자.  

```bash
nano PKGBUILD
```

```PKGBUILD
pkgname=davinci-resolve
pkgver=19.1.3
pkgrel=1

_product="DaVinci Resolve"
_referid='ee1da4f13df74d72b6da783ead2ed875'
_siteurl="https://www.blackmagicdesign.com/api/support/latest-stable-version/davinci-resolve/linux"
sha256sums=('74c1fbab2eebdd5458ab7147e74527346504a7b208912a6c74cc5ec489378ce0')
pkgdesc='Professional A/V post-production software suite from Blackmagic Design'
_archive_name=DaVinci_Resolve_${pkgver}_Linux
_archive_run_name=DaVinci_Resolve_${pkgver}_Linux
conflicts=('davinci-resolve-studio' 'davinci-resolve-beta' 'davinci-resolve-studio-beta')

```

이런식으로 **pkgver=19.1.3**만 바꿔주면 된다.  
물론 해쉬값도 바꿔주면 더 좋다.  
