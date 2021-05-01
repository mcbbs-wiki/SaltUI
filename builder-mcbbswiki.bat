@ECHO OFF
CHCP 65001
SET "OUTPUT=SaltUI-MCBBSWiki.js"
:STAT

ECHO 拼接文件内容为 %OUTPUT%
COPY /b polyfill.js+UI.js+css.js+mcbbs-wiki.js %OUTPUT% > NUL

@REM ECHO 按任意字母键重复操作，按任意数字键退出
@REM CHOICE /c qwertyuiopasdfghjklzxcvbnm0123456789 > NUL
@REM IF %ERRORLEVEL% LSS 27 GOTO STAT