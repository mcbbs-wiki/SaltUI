@ECHO OFF
CHCP 65001
SET "P=prefix.txt"
SET "F1=main.js"
SET "F2=css.js"
SET "OUTPUT=SaltUI.js"
:STAT

ECHO 拼接文件内容为 %OUTPUT%
COPY /b %P%+%F1%+%F2% %OUTPUT% > NUL

ECHO 按任意字母键重复操作，按任意数字键退出
CHOICE /c qwertyuiopasdfghjklzxcvbnm0123456789 > NUL
IF %ERRORLEVEL% LSS 27 GOTO STAT