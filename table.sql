CREATE TABLE [dbo].[count]
(
    [id] INT NOT NULL UNIQUE,
    [creation] DATETIME NULL,
    [agency_type] NVARCHAR(50) NULL,
    [jurisdiction] NVARCHAR(50) NULL,
);



IF OBJECT_ID('[dbo].[count]', 'U') IS NOT NULL
DROP TABLE [dbo].[count]
GO