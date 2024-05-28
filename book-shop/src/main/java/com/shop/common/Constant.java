package com.shop.common;

import java.text.SimpleDateFormat;

public class Constant {
    public static final String SENT_EMAIL_FROM = "doanducminh11082002@gmail.com";
    public static final String ZONED_DATE_FORMAT = "yyyy-MM-dd";
    public static final String STANDARD_STYLE = "utf-8";
    public static int SIZE_OFF_PAGE = 10;
    public static final String FORMAT_DATE_PATTERN = "dd/MM/yyyy";
    public static final String FORMAT_DATE_PATTERN_DETAIL = "dd/MM/yyyy HH:mm:ss";
    public static final SimpleDateFormat FORMAT_DATE = new SimpleDateFormat(FORMAT_DATE_PATTERN);
    public static final SimpleDateFormat FORMAT_DATE_DETAIL = new SimpleDateFormat(FORMAT_DATE_PATTERN_DETAIL);
    public static Integer ZERO_VALUE = 0;

}
