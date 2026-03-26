@echo off
chcp 65001 >nul
echo ========================================
echo   冠帮帮小程序 - 云函数批量部署脚本
echo ========================================
echo.

set PROJECT_PATH=D:\Documents\HBuilderProjects\冠县信息港
set CLOUD_ROOT=%PROJECT_PATH%\uniCloud-tcb\cloudfunctions

echo [1/5] 检查部署环境...
echo    - 项目路径: %PROJECT_PATH%
echo    - 云函数目录: %CLOUD_ROOT%
echo.

echo [2/5] 准备部署以下云函数:
echo    1. deleteItem   (新增 - 删除功能)
echo    2. login         (安全修复 - Token增强)
echo    3. publish       (安全修复 - 输入验证)
echo    4. point-deduct  (安全修复 - 错误脱敏)
echo    5. exchange      (安全修复 - 错误脱敏)
echo.

echo [3/5] 部署说明:
echo.
echo    请在微信开发者工具中按以下步骤操作:
echo    ========================================
echo    1. 打开微信开发者工具
echo    2. 打开项目: %PROJECT_PATH%
echo    3. 等待项目加载完成
echo.
echo    4. 依次右键以下文件夹 -^> "创建并部署：云端安装依赖":
echo       - uniCloud-tcb/cloudfunctions/deleteItem
echo       - uniCloud-tcb/cloudfunctions/login
echo       - uniCloud-tcb/cloudfunctions/publish
echo       - uniCloud-tcb/cloudfunctions/point-deduct
echo       - uniCloud-tcb/cloudfunctions/exchange
echo.
echo    5. 部署完成后，在云开发控制台创建以下数据库集合(如果不存在):
echo       - jobs (职位)
echo       - services (服务)
echo       - nursing (养老护理)
echo       - houses (房屋)
echo       - carpools (顺风车)
echo       - news (资讯)
echo.
echo ========================================
echo.
echo [4/5] 云函数检查...
if exist "%CLOUD_ROOT%\deleteItem" (echo    ✓ deleteItem 目录存在) else (echo    ✗ deleteItem 目录缺失!)
if exist "%CLOUD_ROOT%\login" (echo    ✓ login 目录存在) else (echo    ✗ login 目录缺失!)
if exist "%CLOUD_ROOT%\publish" (echo    ✓ publish 目录存在) else (echo    ✗ publish 目录缺失!)
if exist "%CLOUD_ROOT%\point-deduct" (echo    ✓ point-deduct 目录存在) else (echo    ✗ point-deduct 目录缺失!)
if exist "%CLOUD_ROOT%\exchange" (echo    ✓ exchange 目录存在) else (echo    ✗ exchange 目录缺失!)
echo.

echo [5/5] 部署前置检查完成!
echo.
echo ========================================
echo   下一步: 请在微信开发者工具中手动部署
echo   或者使用 HBuilderX: 右键云函数 -^> 部署到云端
echo ========================================
echo.
pause
