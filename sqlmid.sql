USE [Northwind]

--1 列出各產品的供應商名稱
SELECT p.ProductName, s.CompanyName AS SupplierName
FROM Products p
INNER JOIN Suppliers s ON p.SupplierID = s.SupplierID

--2 列出各產品的種類名稱
SELECT p.ProductName, c.CategoryName
FROM Products p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID;
---------------------------------------------------------
SELECT 
    p.ProductID,
    p.ProductName,
    c.CategoryName
FROM 
    Products p
JOIN 
    Categories c ON p.CategoryID = c.CategoryID
ORDER BY 
    p.ProductID;

--3 列出各訂單的顧客名字
SELECT 
    o.OrderID,
    c.ContactName AS CustomerName
FROM 
    Orders o
JOIN 
    Customers c ON o.CustomerID = c.CustomerID
ORDER BY 
    o.OrderID;
--4 列出各訂單的所負責的物流商名字以及員工名字
SELECT 
    o.OrderID,
    s.CompanyName AS ShipperName,
    e.FirstName + ' ' + e.LastName AS EmployeeName
FROM 
    Orders o
JOIN 
    Shippers s ON o.ShipVia = s.ShipperID
JOIN 
    Employees e ON o.EmployeeID = e.EmployeeID
ORDER BY 
    o.OrderID;

--5 列出1998年的訂單
SELECT 
    OrderID,
    OrderDate,
    CustomerID,
    EmployeeID
FROM 
    Orders
WHERE 
    YEAR(OrderDate) = 1998
ORDER BY 
    OrderDate;

--6 各產品，UnitsInStock < UnitsOnOrder 顯示'供不應求'，否則顯示'正常'
SELECT 
    ProductID,
    ProductName,
    UnitsInStock,
    UnitsOnOrder,
    CASE 
        WHEN UnitsInStock < UnitsOnOrder THEN '供不應求'
        ELSE '正常'
    END AS Status
FROM 
    Products
ORDER BY 
    ProductID;

--7 取得訂單日期最新的9筆訂單
SELECT TOP 9
    OrderID,
    OrderDate,
    CustomerID,
    EmployeeID
FROM 
    Orders
ORDER BY 
    OrderDate DESC;

--8 產品單價最便宜的第4~8名
SELECT 
    ProductID,
    ProductName,
    UnitPrice
FROM 
    Products
ORDER BY 
    UnitPrice
OFFSET 3 ROWS
FETCH NEXT 5 ROWS ONLY;

--9 列出每種類別中最高單價的商品
SELECT 
    CategoryID,
    CategoryName,
    ProductID,
    ProductName,
    UnitPrice
FROM 
    (
        SELECT 
            c.CategoryID,
            c.CategoryName,
            p.ProductID,
            p.ProductName,
            p.UnitPrice,
            ROW_NUMBER() OVER (PARTITION BY c.CategoryID ORDER BY p.UnitPrice DESC) AS RowNum
        FROM 
            Products p
        JOIN 
            Categories c ON p.CategoryID = c.CategoryID
    ) AS RankedProducts
WHERE 
    RowNum = 1
ORDER BY 
    CategoryID;

--10 列出每個訂單的總金額
SELECT OrderID, SUM(UnitPrice * Quantity) AS TotalAmount
FROM [Order Details]
GROUP BY OrderID;
----

--11 列出每個物流商送過的訂單筆數
SELECT 
    s.ShipperID,
    s.CompanyName,
    COUNT(o.OrderID) AS OrderCount
FROM 
    Orders o
JOIN 
    Shippers s ON o.ShipVia = s.ShipperID
GROUP BY 
    s.ShipperID,
    s.CompanyName
ORDER BY 
    s.ShipperID;

--12 列出被下訂次數小於9次的產品
SELECT 
    p.ProductID,
    p.ProductName,
    COUNT(od.OrderID) AS OrderCount
FROM 
    Products p
LEFT JOIN 
    [Order Details] od ON p.ProductID = od.ProductID
GROUP BY 
    p.ProductID,
    p.ProductName
HAVING 
    COUNT(od.OrderID) < 9
ORDER BY 
    OrderCount;

-- (13、14、15請一起寫)----
--13 新增物流商(Shippers)：
-- 公司名稱: 青杉人才，電話: (02)66057606
-- 公司名稱: 青群科技，電話: (02)14055374
INSERT INTO Shippers (CompanyName, Phone)
VALUES 
    ('青杉人才', '(02)66057606'),
    ('青群科技', '(02)14055374');

--14 方才新增的兩筆資料，電話都改成(02)66057606，公司名稱結尾加'有限公司'
UPDATE Shippers
SET 
    Phone = '(02)66057606',
    CompanyName = CompanyName + '有限公司'
WHERE 
    CompanyName IN ('青杉人才', '青群科技');

--15 刪除剛才兩筆資料
DELETE FROM Shippers
WHERE 
    CompanyName IN ('青杉人才有限公司', '青群科技有限公司');    
