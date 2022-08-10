CREATE TABLE [dbo].[count]
(
    [id] INT NOT NULL UNIQUE WITH (IGNORE_DUP_KEY = ON),
    [creation] DATETIME NULL,
    [agency_type] NVARCHAR(50) NULL,
    [jurisdiction] NVARCHAR(50) NULL,
);



IF OBJECT_ID('[dbo].[count]', 'U') IS NOT NULL
DROP TABLE [dbo].[count]
GO