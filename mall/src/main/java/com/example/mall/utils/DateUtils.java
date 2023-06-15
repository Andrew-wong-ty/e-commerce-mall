package com.example.mall.utils;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtils {

    public static String formatDateTime(String inputDateTime) {
        // Parse the input string into a ZonedDateTime object
        ZonedDateTime zdt = ZonedDateTime.parse(inputDateTime);

        // Convert the ZonedDateTime to a LocalDateTime
        LocalDateTime ldt = zdt.toLocalDateTime();

        // Create a formatter for the desired output format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // Format the LocalDateTime using the formatter

        return ldt.format(formatter);
    }

    public static String formatDateTime(Date date) {
        // Create a SimpleDateFormat object with the desired output format
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        // Format the date using the formatter

        return formatter.format(date);
    }
}