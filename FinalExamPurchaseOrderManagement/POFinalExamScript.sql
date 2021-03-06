USE [master]
GO
/****** Object:  Database [FinalExamPOList]    Script Date: 8/17/2020 3:51:17 AM ******/
CREATE DATABASE [FinalExamPOList]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FinalExamPOList', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER01\MSSQL\DATA\FinalExamPOList.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FinalExamPOList_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER01\MSSQL\DATA\FinalExamPOList_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [FinalExamPOList] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FinalExamPOList].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FinalExamPOList] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FinalExamPOList] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FinalExamPOList] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FinalExamPOList] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FinalExamPOList] SET ARITHABORT OFF 
GO
ALTER DATABASE [FinalExamPOList] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FinalExamPOList] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FinalExamPOList] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FinalExamPOList] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FinalExamPOList] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FinalExamPOList] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FinalExamPOList] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FinalExamPOList] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FinalExamPOList] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FinalExamPOList] SET  DISABLE_BROKER 
GO
ALTER DATABASE [FinalExamPOList] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FinalExamPOList] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FinalExamPOList] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FinalExamPOList] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FinalExamPOList] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FinalExamPOList] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FinalExamPOList] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FinalExamPOList] SET RECOVERY FULL 
GO
ALTER DATABASE [FinalExamPOList] SET  MULTI_USER 
GO
ALTER DATABASE [FinalExamPOList] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FinalExamPOList] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FinalExamPOList] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FinalExamPOList] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FinalExamPOList] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'FinalExamPOList', N'ON'
GO
ALTER DATABASE [FinalExamPOList] SET QUERY_STORE = OFF
GO
USE [FinalExamPOList]
GO
/****** Object:  Table [dbo].[Manufacturer]    Script Date: 8/17/2020 3:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Manufacturer](
	[ManufactureNo] [int] IDENTITY(1,1) NOT NULL,
	[ManufacturName] [varchar](50) NULL,
 CONSTRAINT [PK_Manufacturer] PRIMARY KEY CLUSTERED 
(
	[ManufactureNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Part]    Script Date: 8/17/2020 3:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Part](
	[PartNo] [int] IDENTITY(1,1) NOT NULL,
	[PartDescription] [varchar](max) NULL,
	[BuyPrice] [float] NULL,
	[ManufactureNo] [int] NULL,
	[Partcode] [varchar](50) NULL,
 CONSTRAINT [PK_Part] PRIMARY KEY CLUSTERED 
(
	[PartNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrder]    Script Date: 8/17/2020 3:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrder](
	[OrderNo] [int] IDENTITY(1,1) NOT NULL,
	[OrderDate] [date] NULL,
	[ETADate] [date] NULL,
	[LastUpdate] [date] NULL,
	[QtyOpen] [int] NULL,
	[SentEmail] [bit] NULL,
	[SupplierNo] [int] NULL,
	[StockSiteNo] [int] NULL,
	[Note] [varchar](max) NULL,
	[Address] [varchar](max) NULL,
	[Country] [varchar](50) NULL,
	[PostCode] [varchar](50) NULL,
 CONSTRAINT [PK_PurchaseOrder] PRIMARY KEY CLUSTERED 
(
	[OrderNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrderLine]    Script Date: 8/17/2020 3:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrderLine](
	[OrderNo] [int] NOT NULL,
	[PartNo] [int] NOT NULL,
	[Amount] [int] NULL,
	[Memo] [varchar](max) NULL,
 CONSTRAINT [PK_PurchaseOrderLine] PRIMARY KEY CLUSTERED 
(
	[OrderNo] ASC,
	[PartNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StockSite]    Script Date: 8/17/2020 3:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StockSite](
	[StockSiteNo] [int] IDENTITY(1,1) NOT NULL,
	[StockSiteCode] [varchar](50) NULL,
	[StockSiteName] [varchar](max) NULL,
 CONSTRAINT [PK_StockSite] PRIMARY KEY CLUSTERED 
(
	[StockSiteNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Supplier]    Script Date: 8/17/2020 3:51:17 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Supplier](
	[SupplierNo] [int] IDENTITY(1,1) NOT NULL,
	[SupplierCode] [varchar](50) NULL,
	[SupplierName] [varchar](max) NULL,
 CONSTRAINT [PK_Supplier] PRIMARY KEY CLUSTERED 
(
	[SupplierNo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Manufacturer] ON 

INSERT [dbo].[Manufacturer] ([ManufactureNo], [ManufacturName]) VALUES (1, N'Canon')
INSERT [dbo].[Manufacturer] ([ManufactureNo], [ManufacturName]) VALUES (2, N'Ricoh')
INSERT [dbo].[Manufacturer] ([ManufactureNo], [ManufacturName]) VALUES (3, N'Epson')
INSERT [dbo].[Manufacturer] ([ManufactureNo], [ManufacturName]) VALUES (4, N'Daikin')
INSERT [dbo].[Manufacturer] ([ManufactureNo], [ManufacturName]) VALUES (5, N'Fuji')
SET IDENTITY_INSERT [dbo].[Manufacturer] OFF
GO
SET IDENTITY_INSERT [dbo].[Part] ON 

INSERT [dbo].[Part] ([PartNo], [PartDescription], [BuyPrice], [ManufactureNo], [Partcode]) VALUES (1, N'C-EXV 51 TONER Y', 208.79, 1, N'0484C002AA')
INSERT [dbo].[Part] ([PartNo], [PartDescription], [BuyPrice], [ManufactureNo], [Partcode]) VALUES (2, N'Canon iR Adv C5540i', 2830.16, 1, N'iR Adv C5540i')
INSERT [dbo].[Part] ([PartNo], [PartDescription], [BuyPrice], [ManufactureNo], [Partcode]) VALUES (3, N'Ricoh 246rp Super', 3485.16, 2, N'246rp Super')
INSERT [dbo].[Part] ([PartNo], [PartDescription], [BuyPrice], [ManufactureNo], [Partcode]) VALUES (4, N'Epson 30 Active', 1500.05, 3, N'Ep 30 Act')
SET IDENTITY_INSERT [dbo].[Part] OFF
GO
SET IDENTITY_INSERT [dbo].[PurchaseOrder] ON 

INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (1, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-27' AS Date), CAST(N'2019-03-20' AS Date), 3, 0, 1, 3, N'Bobkekk - Sephen Hemeweth', N'b', N'b', N'b')
INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (2, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-21' AS Date), CAST(N'2019-03-20' AS Date), 1, 1, 2, 1, N'a', N'a', N'a', N'a')
INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (3, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-21' AS Date), CAST(N'2019-03-20' AS Date), 1, 0, 3, 7, N'c', N'c', N'c', N'c')
INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (4, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-21' AS Date), CAST(N'2019-03-20' AS Date), 1, 0, 4, 2, N'd', N'd', N'd', N'd')
INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (5, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-21' AS Date), CAST(N'2019-03-20' AS Date), 1, 0, 5, 4, N'e', N'e', N'e', N'e')
INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (6, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-21' AS Date), CAST(N'2019-03-20' AS Date), 1, 0, 6, 5, N'f', N'f', N'f', N'f')
INSERT [dbo].[PurchaseOrder] ([OrderNo], [OrderDate], [ETADate], [LastUpdate], [QtyOpen], [SentEmail], [SupplierNo], [StockSiteNo], [Note], [Address], [Country], [PostCode]) VALUES (7, CAST(N'2019-03-20' AS Date), CAST(N'2019-03-21' AS Date), CAST(N'2019-03-20' AS Date), 5, 0, 7, 6, N'g', N'g', N'g', N'g')
SET IDENTITY_INSERT [dbo].[PurchaseOrder] OFF
GO
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (1, 1, 1, NULL)
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (1, 2, 2, N'Be care full with fragile')
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (2, 3, 1, N'please get the red item')
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (3, 4, 3, NULL)
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (4, 1, 1, N'i need it hurry')
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (4, 3, 2, NULL)
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (5, 4, 1, NULL)
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (6, 2, 2, NULL)
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (7, 1, 3, NULL)
INSERT [dbo].[PurchaseOrderLine] ([OrderNo], [PartNo], [Amount], [Memo]) VALUES (7, 3, 1, N'i would like the green one')
GO
SET IDENTITY_INSERT [dbo].[StockSite] ON 

INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (1, N'LW-DIR', N'tharekp pe Sape SeP erthers')
INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (2, N'LW-OUT', N'eipSeiRkEth Ptha')
INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (3, N'LW-MAN', N'M3 thagapol - Monkhesper Lekk ip')
INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (4, N'IA-MALA', N'Uchiha')
INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (5, N'FU-DAI', N'Camasa')
INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (6, N'HO-LA', N'Itachi')
INSERT [dbo].[StockSite] ([StockSiteNo], [StockSiteCode], [StockSiteName]) VALUES (7, N'LW-DIR', N'Bobkekk')
SET IDENTITY_INSERT [dbo].[StockSite] OFF
GO
SET IDENTITY_INSERT [dbo].[Supplier] ON 

INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (1, N'CANON', N'Konen')
INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (2, N'ADYOUNG', N'ADYOUNG')
INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (3, N'NUANCE', N'NUANCE')
INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (4, N'Westcoast', N'Westcoast')
INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (5, N'Hita', N'Hitachi')
INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (6, N'RICOH', N'RICOH')
INSERT [dbo].[Supplier] ([SupplierNo], [SupplierCode], [SupplierName]) VALUES (7, N'EPSON', N'EPSON')
SET IDENTITY_INSERT [dbo].[Supplier] OFF
GO
ALTER TABLE [dbo].[Part]  WITH CHECK ADD  CONSTRAINT [FK_Part_Manufacturer] FOREIGN KEY([ManufactureNo])
REFERENCES [dbo].[Manufacturer] ([ManufactureNo])
GO
ALTER TABLE [dbo].[Part] CHECK CONSTRAINT [FK_Part_Manufacturer]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrder_StockSite] FOREIGN KEY([StockSiteNo])
REFERENCES [dbo].[StockSite] ([StockSiteNo])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PurchaseOrder_StockSite]
GO
ALTER TABLE [dbo].[PurchaseOrder]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrder_Supplier] FOREIGN KEY([SupplierNo])
REFERENCES [dbo].[Supplier] ([SupplierNo])
GO
ALTER TABLE [dbo].[PurchaseOrder] CHECK CONSTRAINT [FK_PurchaseOrder_Supplier]
GO
ALTER TABLE [dbo].[PurchaseOrderLine]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderLine_Part] FOREIGN KEY([PartNo])
REFERENCES [dbo].[Part] ([PartNo])
GO
ALTER TABLE [dbo].[PurchaseOrderLine] CHECK CONSTRAINT [FK_PurchaseOrderLine_Part]
GO
ALTER TABLE [dbo].[PurchaseOrderLine]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrderLine_PurchaseOrder] FOREIGN KEY([OrderNo])
REFERENCES [dbo].[PurchaseOrder] ([OrderNo])
GO
ALTER TABLE [dbo].[PurchaseOrderLine] CHECK CONSTRAINT [FK_PurchaseOrderLine_PurchaseOrder]
GO
USE [master]
GO
ALTER DATABASE [FinalExamPOList] SET  READ_WRITE 
GO
