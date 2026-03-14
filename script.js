// 生成周报的核心逻辑函数
// 根据姓名、出勤天数、作业完成数，组合成一段较为自然的中文周报
function buildWeeklyReport(name, attendanceDays, homeworkCount) {
  const safeName = name.trim() || "该生";

  // 限制合理范围，避免误填导致内容异常
  const att = Math.min(Math.max(attendanceDays, 0), 7);
  const hw = Math.max(homeworkCount, 0);

  const attendanceParts = [];
  if (att === 7) {
    attendanceParts.push("本周出勤情况良好，能够坚持每天按时到校。");
  } else if (att >= 5) {
    attendanceParts.push(
      `本周共到校 ${att} 天，整体表现较为稳定，缺勤情况较少。`
    );
  } else if (att >= 3) {
    attendanceParts.push(
      `本周到校 ${att} 天，出勤情况有一定波动，需要进一步提高稳定性。`
    );
  } else if (att > 0) {
    attendanceParts.push(
      `本周仅到校 ${att} 天，出勤率偏低，需要家长与学生共同重视出勤情况。`
    );
  } else {
    attendanceParts.push(
      "本周暂无到校记录，请家长与学校保持沟通，关注学生出勤情况。"
    );
  }

  const homeworkParts = [];
  if (hw >= 20) {
    homeworkParts.push(
      `本周共完成作业约 ${hw} 次，任务完成度高，能够主动按时完成各科作业，学习态度认真。`
    );
  } else if (hw >= 10) {
    homeworkParts.push(
      `本周完成作业约 ${hw} 次，整体完成情况较好，大部分作业都能按时、保质完成。`
    );
  } else if (hw >= 5) {
    homeworkParts.push(
      `本周完成作业约 ${hw} 次，能在老师提醒下基本完成日常作业，仍有进一步提升空间。`
    );
  } else if (hw > 0) {
    homeworkParts.push(
      `本周完成作业约 ${hw} 次，作业完成情况一般，需要在时间规划和学习主动性方面继续加强。`
    );
  } else {
    homeworkParts.push(
      "本周暂无完成作业记录，建议家长配合老师督促学生按时独立完成各科作业。"
    );
  }

  const summaryParts = [];
  if (att >= 5 && hw >= 10) {
    summaryParts.push(
      "总体来看，本周学习状态较为积极，能够较好地保持学习节奏，希望继续保持良好习惯，在课堂专注度和知识巩固方面进一步加强。"
    );
  } else if (att >= 3 && hw >= 5) {
    summaryParts.push(
      "总体表现较为平稳，但在学习主动性和自我管理方面仍有提升空间，建议在课后多进行复习与巩固。"
    );
  } else {
    summaryParts.push(
      "总体上，本周在出勤与学习任务完成方面仍有较大提升空间，建议家长加强对学生学习与作息的关注，与老师保持沟通，共同帮助学生逐步养成良好的学习习惯。"
    );
  }

  return `${safeName}同学本周学习情况总结如下：\n\n${attendanceParts.join(
    " "
  )}\n${homeworkParts.join(
    " "
  )}\n${summaryParts.join(
    " "
  )}\n\n后续将继续关注该生在课堂表现与作业完成情况方面的变化，帮助其稳步提升学习效果。`;
}

// 初始化页面交互
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("report-form");
  const nameInput = document.getElementById("student-name");
  const attendanceInput = document.getElementById("attendance-days");
  const homeworkInput = document.getElementById("homework-count");
  const output = document.getElementById("report-output");
  const copyBtn = document.getElementById("copy-btn");
  const statusText = document.getElementById("status-text");

  // 工具函数：状态提示
  function showStatus(message, type) {
    statusText.textContent = message || "";
    statusText.classList.remove("success", "error");
    if (type === "success" || type === "error") {
      statusText.classList.add(type);
    }
  }

  // 提交表单时生成周报
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value;
    const attendanceDays = Number(attendanceInput.value);
    const homeworkCount = Number(homeworkInput.value);

    if (!name.trim()) {
      showStatus("请输入学生姓名。", "error");
      nameInput.focus();
      return;
    }

    if (
      Number.isNaN(attendanceDays) ||
      attendanceDays < 0 ||
      attendanceDays > 7
    ) {
      showStatus("出勤天数需在 0-7 范围内。", "error");
      attendanceInput.focus();
      return;
    }

    if (Number.isNaN(homeworkCount) || homeworkCount < 0) {
      showStatus("作业完成次数不能为负数。", "error");
      homeworkInput.focus();
      return;
    }

    const report = buildWeeklyReport(name, attendanceDays, homeworkCount);
    output.value = report;
    copyBtn.disabled = !report.trim();
    showStatus("周报已生成，如需可一键复制。", "success");
  });

  // 一键复制到剪贴板
  copyBtn.addEventListener("click", async function () {
    const text = output.value;
    if (!text.trim()) {
      showStatus("暂无可复制的周报内容，请先生成。", "error");
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 兼容性处理：使用旧的 execCommand 方式
        output.select();
        document.execCommand("copy");
        output.setSelectionRange(0, 0); // 取消选中
      }
      showStatus("复制成功，已将周报内容复制到剪贴板。", "success");
    } catch (err) {
      console.error(err);
      showStatus("复制失败，请尝试手动选中周报内容后复制。", "error");
    }
  });
});

