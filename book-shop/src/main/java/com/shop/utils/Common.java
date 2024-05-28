package com.shop.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import static com.shop.common.Constant.*;

public class Common {


    public static String formatDateComponents(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        int day = calendar.get(Calendar.DAY_OF_MONTH);
        int month = calendar.get(Calendar.MONTH) + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
        int year = calendar.get(Calendar.YEAR);

        String formattedDay = String.format("%02d", day);
        String formattedMonth = String.format("%02d", month);
        String formattedYear = String.valueOf(year);

        return String.format("%s/%s/%s", formattedDay, formattedMonth, formattedYear);
    }
    public static String convertDateFormat(String originalDate) {
        DateFormat originalFormat = new SimpleDateFormat(ZONED_DATE_FORMAT);
        DateFormat targetFormat = new SimpleDateFormat(FORMAT_DATE_PATTERN);
        try {
            Date date = originalFormat.parse(originalDate);
            return targetFormat.format(date);
        } catch (ParseException e) {
            System.out.println(e.getMessage());
        }
        return null;
    }
    public static boolean isStartDateAfterEndDate(String startDateStr, String endDateStr) {
        try {
            LocalDate startDate = LocalDate.parse(startDateStr);
            LocalDate endDate = LocalDate.parse(endDateStr);
            return startDate.isBefore(endDate);
        } catch (DateTimeParseException e) {
            // Handle invalid date format here
            System.out.println("Invalid date format: " + e.getMessage());
            return false;
        }
    }
    public static Date convertStringToDate(String date){
        Date birthDate;
        try {
            birthDate = FORMAT_DATE.parse(convertDateFormat(date));
            return birthDate;
        } catch (ParseException e) {
            System.out.println(e.getMessage());
        }
        return null;
    }
}
