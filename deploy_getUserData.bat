@echo off
chcp 65001 >nul
title 冠帮帮小程序 - 部署云函数

echo ========================================
echo   冠帮帮小程序 - getUserData 云函数部署
echo ========================================
echo.

echo [1/3] 检查 HBuilderX...
where hbuilderx >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 HBuilderX，请确保已安装
    pause
    exit /b 1
)
echo       HBuilderX 已找到
echo.

echo [2/3] 请在 HBuilderX 中执行以下操作：
echo.
echo       1. 打开项目: D:\Documents\HBuilderProjects\冠县信息港
echo       2. 在左侧目录树找到: uniCloud-tcb/cloudfunctions/getUserData
echo       3. 右键点击 getUserData 文件夹
echo       4. 选择: 上传并部署 -^> 云端安装依赖
echo.
echo [提示] 部署成功后，窗口会显示 "上传成功"
echo.

echo [3/3] 等待确认...
echo.
echo 如果已完成部署，请按任意键继续...
echo 如果尚未部署，请先完成部署后再按任意键
pause >nul

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 下一步：
echo   1. 打开微信开发者工具
echo   2. 刷新项目
echo   3. 测试用户中心功能
echo.
pause
