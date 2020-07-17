using System;

//1 loop
using System;

namespace threeSubArrayTest3
{
    class threeSubArrayTest3
    {
        static int sumArray(int[] a)
        {
            int sum = 0;
            for (int i = 0; i < a.Length; i++)
            {
                sum += a[i];
            }
            return sum;
        }
        static int findEqualMaxTotal(int[] h1, int[] h2, int[] h3)
        {
            // your code goes here
            int h1Sum = sumArray(h1);
            int h2Sum = sumArray(h2);
            int h3Sum = sumArray(h3);
            int min = h1Sum;
            if (h1Sum == h2Sum && h1Sum == h3Sum)
            {
                min = h1Sum;
                return min;
            }
            //find min
            if (h2Sum < min)
                min = h2Sum;
            if (h3Sum < min)
                min = h3Sum;
            int len = h1.Length + h2.Length + h3.Length;
            int h1FE = h1[0], h2FE = h2[0], h3FE = h3[0];
            bool flag = false;
            for(int i = 1; i < len; i++)
            {
                if (i < h1.Length)
                {
                    if (h1Sum - h1FE <= min)
                        { min = h1Sum - h1FE;}    
                    else
                        {h1FE += h1[i];}
                }
                if (i < h2.Length)
                {
                    if (h2Sum - h2FE <= min)
                        { min = h2Sum - h2FE;}
                    else
                        { h2FE += h2[i];}
                }
                if(i < h3.Length)
                {
                    if (h3Sum - h3FE <= min)
                        { min = h3Sum - h3FE;}
                    else
                        { h3FE += h3[i];}
                }
                if((h1Sum - h1FE == min) && (h2Sum - h2FE == min) && (h3Sum - h3FE == min))
                {
                    flag = true;
                    return min;
                }
            }
            if (flag == false)
            {
                min = 0;
                return min;
            }        
            return min;
        }
        static void Main(string[] args)
        {

            int[] h1 = Array.ConvertAll(Console.ReadLine().Split(' '), h1Temp => Convert.ToInt32(h1Temp));

            int[] h2 = Array.ConvertAll(Console.ReadLine().Split(' '), h2Temp => Convert.ToInt32(h2Temp));

            int[] h3 = Array.ConvertAll(Console.ReadLine().Split(' '), h3Temp => Convert.ToInt32(h3Temp));

            int result = findEqualMaxTotal(h1, h2, h3);

            Console.WriteLine(result);
            Console.ReadLine();
        }
    }
}

//3 loops
namespace threeSubArrayTest3
{
    class threeSubArrayTest3
    {
        static int sumArray(int[] a, int startPosition)
        {
            int sum = 0;
            for(int i = startPosition; i < a.Length; i++)
            {
                sum += a[i];
            }
            return sum;
        }
        static int findEqualMaxTotal(int[] h1, int[] h2, int[] h3)
        {
            // your code goes here
            int h1Sum = sumArray(h1, 0);
            int h2Sum = sumArray(h2, 0);
            int h3Sum = sumArray(h3, 0);
            int min = h1Sum;
            if (h1Sum == h2Sum && h1Sum == h3Sum)
            {
                min = h1Sum;
                return min;
            }
               
            if (h2Sum < min)
            {
                min = h2Sum;
                int h2k = 0;
                while(h2k < h2.Length)
                {
                    int m1 = 1;
                    int sumh1 = 0;
                    while(m1 < h1.Length)
                    {
                        sumh1 = sumArray(h1, m1);
                        if (sumh1 <= min)
                        {
                            min = sumh1;
                            break;
                        }   
                        m1++;
                    }
                    int m2 = 1;
                    int sumh3 = 0;
                    while (m2 < h3.Length)
                    {
                        sumh3 = sumArray(h3, m2);
                        if (sumh3 <= min)
                        {
                            min = sumh1;
                            break;
                        }
                        m2++;
                    }
                    if (min == sumArray(h2, h2k))
                        return min;
                    h2k++;
                }
            }

            if (h3Sum < min)
            {
                min = h3Sum;
                int h3k = 0;
                while (h3k < h2.Length)
                {
                    int m1 = 1;
                    int sumh1 = 0;
                    while (m1 < h1.Length)
                    {
                        sumh1 = sumArray(h1, m1);
                        if (sumh1 <= min)
                        {
                            min = sumh1;
                            break;
                        }
                        m1++;
                    }
                    int m2 = 1;
                    int sumh3 = 0;
                    while (m2 < h3.Length)
                    {
                        sumh3 = sumArray(h3, m2);
                        if (sumh3 <= min)
                        {
                            min = sumh1;
                            break;
                        }
                        m2++;
                    }
                    if (min == sumArray(h2, h3k))
                        return min;
                    h3k++;
                }
            }

            int h1k = 0;
            while (h1k < h2.Length)
            {
                int m1 = 1;
                int sumh1 = 0;
                while (m1 < h1.Length)
                {
                    sumh1 = sumArray(h1, m1);
                    if (sumh1 <= min)
                    {
                        min = sumh1;
                        break;
                    }
                    m1++;
                }
                int m2 = 1;
                int sumh3 = 0;
                while (m2 < h3.Length)
                {
                    sumh3 = sumArray(h3, m2);
                    if (sumh3 <= min)
                    {
                        min = sumh1;
                        break;
                    }
                    m2++;
                }
                if (min == sumArray(h2, h1k))
                    return min;
                h1k++;
            }
            return min;
        }
        static void Main(string[] args)
        {

            int[] h1 = Array.ConvertAll(Console.ReadLine().Split(' '), h1Temp => Convert.ToInt32(h1Temp));

            int[] h2 = Array.ConvertAll(Console.ReadLine().Split(' '), h2Temp => Convert.ToInt32(h2Temp));

            int[] h3 = Array.ConvertAll(Console.ReadLine().Split(' '), h3Temp => Convert.ToInt32(h3Temp));

            int result = findEqualMaxTotal(h1, h2, h3);

            Console.WriteLine(result);
            Console.ReadLine();
        }
    }
}
